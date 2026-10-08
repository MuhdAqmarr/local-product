import type { Product } from "../types";
import { fetchJson } from "./http";
import { cleanText, discountOf, httpsUrl, isJunk, toIso } from "./normalize";

interface ShopifyVariant {
  price: string;
  compare_at_price: string | null;
  available?: boolean;
}

interface ShopifyImage {
  src: string;
  width?: number;
  height?: number;
}

interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  published_at?: string | null;
  created_at?: string | null;
  product_type?: string;
  tags?: string[] | string;
  variants?: ShopifyVariant[];
  images?: ShopifyImage[];
}

export interface ShopifyMeta {
  name?: string;
  currency?: string;
  country?: string;
  province?: string;
  city?: string;
  published_products_count?: number;
}

export function fetchShopifyMeta(origin: string): Promise<ShopifyMeta> {
  return fetchJson<ShopifyMeta>(`${origin}/meta.json`);
}

/** products.json is ordered newest-published first; one page of 250 covers launches and most promos. */
export async function fetchShopifyProducts(origin: string, brand: string, currency: string): Promise<Product[]> {
  const data = await fetchJson<{ products?: ShopifyProduct[] }>(`${origin}/products.json?limit=250`);
  if (!Array.isArray(data.products)) throw new Error(`No products array from ${origin}`);
  return data.products.flatMap((p) => normalize(p, origin, brand, currency) ?? []);
}

function normalize(p: ShopifyProduct, origin: string, brand: string, currency: string): Product | null {
  const tags = Array.isArray(p.tags) ? p.tags.join(" ") : p.tags;
  if (isJunk(p.title, p.product_type, tags)) return null;

  const variants = (p.variants ?? [])
    .map((v) => ({
      price: Number(v.price),
      compareAt: v.compare_at_price ? Number(v.compare_at_price) : undefined,
      available: v.available !== false,
    }))
    .filter((v) => Number.isFinite(v.price) && v.price >= 1);
  if (variants.length === 0) return null;

  const available = variants.some((v) => v.available);
  const pool = available ? variants.filter((v) => v.available) : variants;
  // Show the deepest real discount if any variant has one, otherwise the cheapest variant.
  const scored = pool.map((v) => ({ ...v, discount: discountOf(v.price, v.compareAt) }));
  const promo = scored
    .filter((v) => v.discount !== undefined)
    .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0) || a.price - b.price)[0];
  const shown = promo ?? scored.reduce((a, b) => (b.price < a.price ? b : a));

  const image = p.images?.[0];
  return {
    id: `${brand}:${p.id}`,
    brand,
    title: cleanText(p.title),
    url: `${origin}/products/${p.handle}`,
    image: httpsUrl(image?.src),
    imageW: image?.width,
    imageH: image?.height,
    price: shown.price,
    compareAt: shown.discount !== undefined ? shown.compareAt : undefined,
    discount: shown.discount,
    currency,
    publishedAt: toIso(p.published_at ?? p.created_at),
    available,
    type: p.product_type ? cleanText(p.product_type) : undefined,
  };
}
