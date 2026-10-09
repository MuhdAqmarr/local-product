/**
 * Wire format of the prerendered JSON feeds (`/api/feed/promos`, `/api/feed/new`,
 * `/api/feed/search`). Pure module: the server encodes with it (src/lib/catalog.ts) and the
 * client decodes with it (load-more.tsx, search-provider.tsx), so both sides always agree.
 * Decoding gives back the full `ProductCardData` / `SearchItem` shape, so no consumer changes.
 *
 * Slimming rules (the feeds are fetched on interaction, mostly on phones):
 * - brand fields (name, category, tier) live once in a brand table, not on every row;
 * - `brand` is the `id` prefix (`${brandSlug}:${sourceId}`);
 * - each brand row keeps a link base (e.g. `https://store.my/products/`) and an image base
 *   (its Shopify files folder); rows keep only the rest. A value that still starts with
 *   `http(s)://` did not share the base and is used as is;
 * - `currency` is omitted when MYR, `available` when true;
 * - `publishedAt` is epoch seconds (feed timestamps are whole-second UTC ISO strings, so decoding
 *   gives back the exact string the server sorted and grouped with; others travel as is);
 * - card rows use one-letter keys, search product rows are tuples.
 */
import type { CategorySlug, ProductCardData, TierSlug } from "@/lib/types";
import type { SearchItem } from "@/lib/catalog";

/** [name, category, tier, link base, image base] ("" when the brand has none). */
export type WireBrand = [name: string, category: CategorySlug, tier: TierSlug, linkBase: string, imageBase: string];

/** One product row of `/api/feed/promos` and `/api/feed/new`. */
export interface WireCard {
  /** id */
  i: string;
  /** title */
  n: string;
  /** url (after the brand's link base) */
  u: string;
  /** image (after the brand's image base) */
  m?: string;
  /** imageW, imageH */
  w?: number;
  h?: number;
  /** price, compareAt, discount */
  p: number;
  c?: number;
  d?: number;
  /** currency, only when not MYR */
  $?: string;
  /** publishedAt: epoch seconds (an ISO string only if it would not round-trip exactly) */
  t?: number | string;
  /** type (the listing's text filter searches it) */
  k?: string;
  /** available, only when false */
  a?: 0;
}

export interface CardFeed {
  brands: Record<string, WireBrand>;
  items: WireCard[];
}

/** [sourceId, title, link (after the brand's base), image (after the brand's base, "" = none), price, discount (0 = none), currency (only when not MYR)] */
export type WireSearchProduct = [sourceId: string, title: string, href: string, image: string, price: number, discount?: number, currency?: string];

/** Brand row of `/api/feed/search` with its products (brand = id, href = /brands/{id}). */
export interface WireSearchBrand {
  id: string;
  title: string;
  category: CategorySlug;
  tier: TierSlug;
  state?: string;
  /** Link and image bases of this brand's products. */
  u?: string;
  m?: string;
  products: WireSearchProduct[];
}

export interface SearchFeed {
  brands: WireSearchBrand[];
}

/* ------------------------------------------------------------------ */
/* Shared field codecs                                                  */
/* ------------------------------------------------------------------ */

const ABSOLUTE = /^https?:\/\//;
const brandOf = (id: string) => id.slice(0, id.indexOf(":"));

/** `https://store.my/products/` from `https://store.my/products/handle?x` (dir of the path). */
function linkBase(url: string): string {
  const m = /^https?:\/\/[^/?#]+(?:\/[^?#]*)?\//.exec(url);
  return m ? m[0] : "";
}

/** The store's Shopify files folder, e.g. `https://cdn.shopify.com/s/files/1/0921/1566/5177/files/`. */
function imageBase(src: string | undefined): string {
  const m = src ? /^https:\/\/cdn\.shopify\.com\/s\/files\/(?:\d+\/){2,5}(?:files|products)\//.exec(src) : null;
  return m ? m[0] : "";
}

const pack = (value: string, base: string) => (base && value.startsWith(base) && value.length > base.length ? value.slice(base.length) : value);
const unpack = (value: string, base: string) => (ABSOLUTE.test(value) ? value : base + value);

function packTime(iso: string | undefined): number | string | undefined {
  if (!iso) return undefined;
  const t = Date.parse(iso);
  return Number.isFinite(t) && t % 1000 === 0 && new Date(t).toISOString() === iso ? t / 1000 : iso;
}
const unpackTime = (t: number | string) => (typeof t === "number" ? new Date(t * 1000).toISOString() : t);

/* ------------------------------------------------------------------ */
/* Promos / new                                                         */
/* ------------------------------------------------------------------ */

export function encodeCards(list: ProductCardData[]): CardFeed {
  const brands: Record<string, WireBrand> = {};
  for (const p of list) {
    const b = (brands[p.brand] ??= [p.brandName, p.brandCategory, p.brandTier, linkBase(p.url), ""]);
    if (!b[4] && p.image) b[4] = imageBase(p.image);
  }
  const items = list.map((p): WireCard => {
    const [, , , u, m] = brands[p.brand];
    const row: WireCard = { i: p.id, n: p.title, u: pack(p.url, u), p: p.price };
    if (p.image) row.m = pack(p.image, m);
    if (p.imageW != null) row.w = p.imageW;
    if (p.imageH != null) row.h = p.imageH;
    if (p.compareAt != null) row.c = p.compareAt;
    if (p.discount != null) row.d = p.discount;
    if (p.currency !== "MYR") row.$ = p.currency;
    const t = packTime(p.publishedAt);
    if (t != null) row.t = t;
    if (p.type) row.k = p.type;
    if (!p.available) row.a = 0;
    return row;
  });
  return { brands, items };
}

export function decodeCards(feed: CardFeed): ProductCardData[] {
  return feed.items.map((r) => {
    const slug = brandOf(r.i);
    const [brandName, brandCategory, brandTier, u, m] = feed.brands[slug] ?? [slug, "lifestyle", "cili-padi", "", ""];
    const p: ProductCardData = {
      id: r.i,
      brand: slug,
      title: r.n,
      url: unpack(r.u, u),
      price: r.p,
      currency: r.$ ?? "MYR",
      available: r.a !== 0,
      brandName,
      brandCategory,
      brandTier,
    };
    if (r.m) p.image = unpack(r.m, m);
    if (r.w != null) p.imageW = r.w;
    if (r.h != null) p.imageH = r.h;
    if (r.c != null) p.compareAt = r.c;
    if (r.d != null) p.discount = r.d;
    if (r.t != null) p.publishedAt = unpackTime(r.t);
    if (r.k) p.type = r.k;
    return p;
  });
}

/* ------------------------------------------------------------------ */
/* Search                                                               */
/* ------------------------------------------------------------------ */

type SearchBrandInput = Omit<WireSearchBrand, "u" | "m" | "products">;

/** Products are grouped under their brand; brands without products keep an empty list. */
export function encodeSearch(brands: SearchBrandInput[], products: ProductCardData[]): SearchFeed {
  const rows = new Map<string, WireSearchBrand>(brands.map((b) => [b.id, { ...b, products: [] }]));
  for (const p of products) {
    const b = rows.get(p.brand);
    if (!b) continue;
    b.u ||= linkBase(p.url);
    if (!b.m && p.image) b.m = imageBase(p.image);
    const row: WireSearchProduct = [p.id.slice(p.brand.length + 1), p.title, pack(p.url, b.u ?? ""), p.image ? pack(p.image, b.m ?? "") : "", p.price];
    if (p.discount != null || p.currency !== "MYR") row.push(p.discount ?? 0);
    if (p.currency !== "MYR") row.push(p.currency);
    b.products.push(row);
  }
  return { brands: [...rows.values()].map((b) => (b.m === "" ? { ...b, m: undefined } : b)) };
}

export function decodeSearch(feed: SearchFeed): SearchItem[] {
  const brands: SearchItem[] = [];
  const products: SearchItem[] = [];
  for (const b of feed.brands) {
    brands.push({
      kind: "brand",
      id: b.id,
      title: b.title,
      brand: b.id,
      brandName: b.title,
      category: b.category,
      href: `/brands/${b.id}`,
      tier: b.tier,
      ...(b.state ? { state: b.state } : {}),
    });
    for (const [sid, title, href, image, price, discount, currency] of b.products) {
      products.push({
        kind: "product",
        id: `${b.id}:${sid}`,
        title,
        brand: b.id,
        brandName: b.title,
        category: b.category,
        href: unpack(href, b.u ?? ""),
        image: image ? unpack(image, b.m ?? "") : undefined,
        price,
        currency: currency ?? "MYR",
        discount: discount || undefined,
      });
    }
  }
  return [...brands, ...products];
}

/**
 * Cache-Control for the feed route handlers: browsers reuse a feed for 5 min across client
 * navigations; the CDN keeps it 3 h (the catalog's revalidate) and may serve it stale while it
 * refreshes in the background, up to a week.
 */
export const FEED_CACHE = "public, max-age=300, s-maxage=10800, stale-while-revalidate=594000";
