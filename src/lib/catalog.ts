import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import snapshotJson from "@/data/snapshot.json";
import { BRANDS, getBrand } from "./brands";
import { refreshCatalog } from "./feeds/refresh";
import { CATEGORIES, NEW_WINDOW_DAYS } from "./taxonomy";
import type { Brand, Catalog, CategorySlug, FeedStatus, Product, ProductCardData, Snapshot, TierSlug } from "./types";

const SNAPSHOT = snapshotJson as unknown as Snapshot;

/**
 * Live store reads happen only at runtime on Vercel (or when LOKAL_LIVE=1 locally).
 * Builds render from the snapshot that `npm run sync` refreshes in `prebuild`.
 */
function liveFetchEnabled(): boolean {
  if (process.env.NEXT_PHASE === "phase-production-build") return false;
  if (process.env.LOKAL_LIVE === "0") return false;
  return process.env.VERCEL === "1" || process.env.LOKAL_LIVE === "1";
}

// Several cached selectors can miss together on a cold instance. They share one
// round of store requests instead of each hitting every store.
const LIVE_REUSE_MS = 10 * 60 * 1000;
let inflight: Promise<Snapshot> | null = null;
let lastLive: { at: number; snapshot: Snapshot } | null = null;

function liveSnapshot(): Promise<Snapshot> {
  if (lastLive && Date.now() - lastLive.at < LIVE_REUSE_MS) return Promise.resolve(lastLive.snapshot);
  inflight ??= refreshCatalog(BRANDS, SNAPSHOT, { concurrency: 10 })
    .then((snapshot) => {
      lastLive = { at: Date.now(), snapshot };
      return snapshot;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife("catalog");
  cacheTag("catalog");
  if (!liveFetchEnabled()) return { ...SNAPSHOT, source: "snapshot" };
  return { ...(await liveSnapshot()), source: "live" };
}

// ---------------------------------------------------------------------------
// Selectors. Each is cached on its own so pages store only the slice they use.
// ---------------------------------------------------------------------------

const isDefined = <T,>(value: T | null | undefined): value is T => value != null;

function toCard(p: Product): ProductCardData | null {
  const brand = getBrand(p.brand);
  if (!brand) return null;
  return { ...p, brandName: brand.name, brandCategory: brand.category, brandTier: brand.tier };
}

const newestFirst = (a: Product, b: Product) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
const biggestDiscount = (a: Product, b: Product) => (b.discount ?? 0) - (a.discount ?? 0) || newestFirst(a, b);

/**
 * `perBrand` caps how many items one brand may contribute. `mixed` interleaves:
 * every brand shows its best item before any brand shows a second.
 */
function arrange<T extends Product>(items: T[], compare: (a: T, b: T) => number, order: "mixed" | "ranked", perBrand = Infinity): T[] {
  const counts = new Map<string, number>();
  const ranked = [...items]
    .sort(compare)
    .map((item, index) => {
      const rank = counts.get(item.brand) ?? 0;
      counts.set(item.brand, rank + 1);
      return { item, rank, index };
    })
    .filter((x) => x.rank < perBrand);
  if (order === "mixed") ranked.sort((a, b) => a.rank - b.rank || a.index - b.index);
  return ranked.map((x) => x.item);
}

export interface ListOptions {
  category?: CategorySlug;
  brand?: string;
  limit?: number;
  perBrand?: number;
  order?: "mixed" | "ranked";
}

function scope(products: Product[], { category, brand }: ListOptions): ProductCardData[] {
  return products
    .map(toCard)
    .filter(isDefined)
    .filter((p) => (!category || p.brandCategory === category) && (!brand || p.brand === brand));
}

function isNew(p: Product, syncedAt: string): boolean {
  if (!p.publishedAt) return false;
  return Date.parse(syncedAt) - Date.parse(p.publishedAt) <= NEW_WINDOW_DAYS * 86_400_000;
}

export async function getPromos(options: ListOptions = {}): Promise<ProductCardData[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("catalog");
  const { products } = await getCatalog();
  const list = scope(products, options).filter((p) => p.discount !== undefined && p.available);
  return arrange(list, biggestDiscount, options.order ?? "mixed", options.perBrand).slice(0, options.limit);
}

export async function getNewLaunches(options: ListOptions = {}): Promise<ProductCardData[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("catalog");
  const { products, syncedAt } = await getCatalog();
  const list = scope(products, options).filter((p) => p.available && isNew(p, syncedAt));
  return arrange(list, newestFirst, options.order ?? "ranked", options.perBrand).slice(0, options.limit);
}

export interface BrandProducts {
  promos: ProductCardData[];
  newest: ProductCardData[];
  status?: FeedStatus;
  syncedAt: string;
}

export async function getBrandProducts(slug: string): Promise<BrandProducts> {
  "use cache";
  cacheLife("catalog");
  cacheTag("catalog");
  const { products, feeds, syncedAt } = await getCatalog();
  const mine = scope(products, { brand: slug });
  return {
    promos: mine.filter((p) => p.discount !== undefined && p.available).sort(biggestDiscount),
    newest: [...mine].sort(newestFirst),
    status: feeds[slug],
    syncedAt,
  };
}

export interface SiteStats {
  brands: number;
  liveBrands: number;
  products: number;
  promos: number;
  newLaunches: number;
  maxDiscount: number;
  syncedAt: string;
  source: Catalog["source"];
}

export async function getStats(): Promise<SiteStats> {
  "use cache";
  cacheLife("catalog");
  cacheTag("catalog");
  const { products, feeds, syncedAt, source } = await getCatalog();
  const promos = products.filter((p) => p.discount !== undefined && p.available);
  return {
    brands: BRANDS.length,
    liveBrands: Object.values(feeds).filter((f) => f.status !== "error").length,
    products: products.length,
    promos: promos.length,
    newLaunches: products.filter((p) => p.available && isNew(p, syncedAt)).length,
    maxDiscount: promos.reduce((max, p) => Math.max(max, p.discount ?? 0), 0),
    syncedAt,
    source,
  };
}

/** Everything a brand card needs; small enough to ship the whole directory to the client. */
export interface BrandSummary {
  slug: string;
  name: string;
  category: CategorySlug;
  subcategory: string;
  tier: TierSlug;
  description: string;
  state?: Brand["state"];
  origin?: string;
  founded?: number;
  tags: string[];
  live: boolean;
  promoCount: number;
  newCount: number;
  maxDiscount: number;
  /** Up to 3 recent product photos for the card collage. */
  previews: string[];
}

export async function getBrandSummaries(): Promise<BrandSummary[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("catalog");
  const { products, feeds, syncedAt } = await getCatalog();
  const byBrand = new Map<string, Product[]>();
  for (const p of products) {
    const list = byBrand.get(p.brand);
    if (list) list.push(p);
    else byBrand.set(p.brand, [p]);
  }
  return BRANDS.map((b) => {
    const mine = (byBrand.get(b.slug) ?? []).sort(newestFirst);
    const promos = mine.filter((p) => p.discount !== undefined && p.available);
    return {
      slug: b.slug,
      name: b.name,
      category: b.category,
      subcategory: b.subcategory,
      tier: b.tier,
      description: b.description,
      state: b.state,
      origin: b.origin,
      founded: b.founded,
      tags: b.tags,
      live: Boolean(b.feed) && feeds[b.slug]?.status !== "error" && mine.length > 0,
      promoCount: promos.length,
      newCount: mine.filter((p) => p.available && isNew(p, syncedAt)).length,
      maxDiscount: promos.reduce((max, p) => Math.max(max, p.discount ?? 0), 0),
      previews: mine.filter((p) => p.image).slice(0, 3).map((p) => p.image!),
    };
  });
}

export interface CategorySummary {
  slug: CategorySlug;
  brands: number;
  promos: number;
  newLaunches: number;
  previews: string[];
}

export async function getCategorySummaries(): Promise<CategorySummary[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("catalog");
  const summaries = await getBrandSummaries();
  return CATEGORIES.map((c) => {
    const inCat = summaries.filter((b) => b.category === c.slug);
    return {
      slug: c.slug,
      brands: inCat.length,
      promos: inCat.reduce((n, b) => n + b.promoCount, 0),
      newLaunches: inCat.reduce((n, b) => n + b.newCount, 0),
      previews: inCat.flatMap((b) => b.previews.slice(0, 1)).slice(0, 4),
    };
  });
}

/** Compact rows for the client-side search modal: brands first, then products. */
export interface SearchItem {
  kind: "brand" | "product";
  id: string;
  title: string;
  brand: string;
  brandName: string;
  category: CategorySlug;
  href: string;
  image?: string;
  price?: number;
  currency?: string;
  discount?: number;
}

export async function getSearchIndex(): Promise<SearchItem[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("catalog");
  const { products } = await getCatalog();
  const brands: SearchItem[] = BRANDS.map((b) => ({
    kind: "brand",
    id: b.slug,
    title: b.name,
    brand: b.slug,
    brandName: b.name,
    category: b.category,
    href: `/brands/${b.slug}`,
  }));
  const items: SearchItem[] = scope(products, {})
    .filter((p) => p.available)
    .map((p) => ({
      kind: "product",
      id: p.id,
      title: p.title,
      brand: p.brand,
      brandName: p.brandName,
      category: p.brandCategory,
      href: p.url,
      image: p.image,
      price: p.price,
      currency: p.currency,
      discount: p.discount,
    }));
  return [...brands, ...items];
}
