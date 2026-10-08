import type { Product } from "../types";
import { fetchJson } from "./http";
import { cleanText, discountOf, httpsUrl, isJunk, toIso } from "./normalize";

interface WooPrices {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_code: string;
  currency_minor_unit: number;
  price_range?: { min_amount: string; max_amount: string } | null;
}

interface WooProduct {
  id: number;
  name: string;
  permalink: string;
  on_sale: boolean;
  is_in_stock: boolean;
  prices: WooPrices;
  images?: Array<{ src: string; thumbnail?: string }>;
  categories?: Array<{ name: string }>;
}

/**
 * The Store API has no publish dates, so we ask the WP REST API for them separately;
 * stores that hide it still list products, just without the "Baru" signal.
 */
export async function fetchWooProducts(origin: string, brand: string): Promise<{ products: Product[]; currency: string }> {
  const list = await fetchJson<WooProduct[]>(`${origin}/wp-json/wc/store/v1/products?per_page=100&orderby=date&order=desc`);
  if (!Array.isArray(list)) throw new Error(`Unexpected WooCommerce response from ${origin}`);

  const dates = new Map<number, string>();
  try {
    const posts = await fetchJson<Array<{ id: number; date_gmt: string }>>(
      `${origin}/wp-json/wp/v2/product?per_page=100&orderby=date&order=desc&_fields=id,date_gmt`,
    );
    for (const post of posts) {
      const iso = toIso(post.date_gmt.endsWith("Z") ? post.date_gmt : `${post.date_gmt}Z`);
      if (iso) dates.set(post.id, iso);
    }
  } catch {
    // Dates are a nice-to-have.
  }

  let currency = "MYR";
  const products = list.flatMap((p): Product[] => {
    const name = cleanText(p.name);
    if (isJunk(name, p.categories?.map((c) => c.name).join(" "))) return [];
    const unit = 10 ** (p.prices?.currency_minor_unit ?? 2);
    const price = Number(p.prices?.price_range?.min_amount ?? p.prices?.price) / unit;
    const regular = Number(p.prices?.regular_price) / unit;
    if (!Number.isFinite(price) || price < 1) return [];
    currency = p.prices.currency_code || currency;
    const discount = p.on_sale ? discountOf(price, regular) : undefined;
    const image = p.images?.[0];
    return [
      {
        id: `${brand}:${p.id}`,
        brand,
        title: name,
        url: p.permalink,
        image: httpsUrl(image?.thumbnail || image?.src),
        price,
        compareAt: discount !== undefined ? regular : undefined,
        discount,
        currency: p.prices.currency_code || "MYR",
        publishedAt: dates.get(p.id),
        available: p.is_in_stock,
        type: p.categories?.[0]?.name ? cleanText(p.categories[0].name) : undefined,
      },
    ];
  });
  return { products, currency };
}
