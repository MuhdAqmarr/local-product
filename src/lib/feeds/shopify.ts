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

/**
 * Shopify Markets localises products.json by the requester's IP: the same store answers
 * in MYR from Malaysia, SGD from Singapore (our Vercel functions) and USD from the US
 * (our build machines). Asking for the Malaysian market explicitly keeps prices in what
 * Malaysian shoppers actually pay, wherever the request comes from.
 */
const MALAYSIA_MARKET = { cookie: "localization=MY; cart_currency=MYR" };

export function fetchShopifyMeta(origin: string): Promise<ShopifyMeta> {
  return fetchJson<ShopifyMeta>(`${origin}/meta.json`, { headers: MALAYSIA_MARKET });
}

/**
 * The currency products.json prices are presented in for the Malaysian market. A store
 * without a Malaysian market answers in its base currency (e.g. USD), so we must ask:
 * meta.json only reports the base currency, which is wrong for stores that do have one.
 */
export async function fetchShopifyCurrency(origin: string): Promise<string | undefined> {
  const cart = await fetchJson<{ currency?: string }>(`${origin}/cart.js`, { headers: MALAYSIA_MARKET });
  return typeof cart.currency === "string" && /^[A-Z]{3}$/.test(cart.currency) ? cart.currency : undefined;
}

/** products.json is ordered newest-published first; one page of 250 covers launches and most promos. */
export async function fetchShopifyProducts(origin: string, brand: string, currency: string): Promise<Product[]> {
  const data = await fetchJson<{ products?: ShopifyProduct[] }>(`${origin}/products.json?limit=250`, { headers: MALAYSIA_MARKET });
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
