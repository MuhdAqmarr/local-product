import type { Brand, FeedStatus, Product, Snapshot } from "../types";
import { mapPool } from "./http";
import { selectForBrand } from "./normalize";
import { fetchShopifyCurrency, fetchShopifyMeta, fetchShopifyProducts } from "./shopify";
import { fetchWooProducts } from "./woocommerce";

export interface RefreshOptions {
  /** Also read Shopify /meta.json (store country, product count). The sync script does; live refreshes reuse the snapshot's values. */
  withMeta?: boolean;
  concurrency?: number;
  onBrand?: (brand: Brand, status: FeedStatus, count: number) => void;
}

async function fetchBrand(brand: Brand, prev: FeedStatus | undefined, withMeta: boolean): Promise<{ status: FeedStatus; products: Product[] }> {
  const feed = brand.feed!;
  const fetchedAt = new Date().toISOString();

  if (feed.type === "shopify") {
    let country = prev?.country;
    let totalProducts = prev?.totalProducts;
    if (withMeta) {
      try {
        const meta = await fetchShopifyMeta(feed.origin);
        country = meta.country ?? country;
        totalProducts = meta.published_products_count ?? totalProducts;
      } catch {
        // meta.json is optional; products.json is what matters.
      }
    }
    // Ask every time: a store can add or drop its Malaysian market between refreshes.
    const currency = (await fetchShopifyCurrency(feed.origin).catch(() => undefined)) ?? prev?.currency ?? "MYR";
    const products = await fetchShopifyProducts(feed.origin, brand.slug, currency);
    return { status: { status: "live", platform: "shopify", currency, country, totalProducts, fetchedAt }, products };
  }

  const { products, currency } = await fetchWooProducts(feed.origin, brand.slug);
  return { status: { status: "live", platform: "woocommerce", currency, country: prev?.country, totalProducts: prev?.totalProducts, fetchedAt }, products };
}

/**
 * Fetch every brand feed and build a fresh snapshot. A brand whose store fails keeps
 * its products from `prev`, so a flaky store never empties its page.
 */
export async function refreshCatalog(brands: readonly Brand[], prev: Snapshot | null, options: RefreshOptions = {}): Promise<Snapshot> {
  const { withMeta = false, concurrency = 8, onBrand } = options;
  const prevProducts = new Map<string, Product[]>();
  for (const p of prev?.products ?? []) {
    const list = prevProducts.get(p.brand);
    if (list) list.push(p);
    else prevProducts.set(p.brand, [p]);
  }

  const now = Date.now();
  const feedBrands = brands.filter((b) => b.feed);
  const results = await mapPool(feedBrands, concurrency, async (brand) => {
    const before = prev?.feeds[brand.slug];
    try {
      const { status, products } = await fetchBrand(brand, before, withMeta);
      const kept = selectForBrand(products, { now });
      onBrand?.(brand, status, kept.length);
      return { slug: brand.slug, status, products: kept };
    } catch (err) {
      const kept = prevProducts.get(brand.slug) ?? [];
      const status: FeedStatus = {
        status: before?.fetchedAt ? "snapshot" : "error",
        platform: brand.feed!.type,
        currency: before?.currency ?? "MYR",
        country: before?.country,
        totalProducts: before?.totalProducts,
        fetchedAt: before?.fetchedAt,
        error: err instanceof Error ? err.message : String(err),
      };
      onBrand?.(brand, status, kept.length);
      return { slug: brand.slug, status, products: kept };
    }
  });

  return {
    version: 1,
    syncedAt: new Date(now).toISOString(),
    feeds: Object.fromEntries(results.map((r) => [r.slug, r.status])),
    products: results.flatMap((r) => r.products),
  };
}
