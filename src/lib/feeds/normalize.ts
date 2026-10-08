import { MAX_PROMO_DISCOUNT, MIN_PROMO_DISCOUNT } from "../taxonomy";
import type { Product } from "../types";

/** Things stores sell that are not products: gift cards, fees, protection add-ons, test items. */
const JUNK =
  /\b(gift ?cards?|e-?gift|e-?vouchers?|vouchers?|shipping|postage|insurance|protection|donat(e|ion)|tips?|deposit|add-?ons?|tester|booking fee|service fee|custom(isation|ization)? fee|test product|do not (buy|purchase))\b/i;

export function isJunk(...fields: Array<string | undefined>): boolean {
  return fields.some((field) => field !== undefined && JUNK.test(field));
}

/** Whole-number percent off, or undefined when it is not a believable promo. */
export function discountOf(price: number, compareAt: number | undefined): number | undefined {
  if (!compareAt || !(compareAt > price) || price <= 0) return undefined;
  const pct = Math.round(((compareAt - price) / compareAt) * 100);
  return pct >= MIN_PROMO_DISCOUNT && pct <= MAX_PROMO_DISCOUNT ? pct : undefined;
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", hellip: "…" };

/** Product names from WordPress arrive HTML-escaped and sometimes wrapped in tags. */
export function cleanText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name: string) => ENTITIES[name.toLowerCase()] ?? match)
    .replace(/\s+/g, " ")
    .trim();
}

export function toIso(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const time = Date.parse(value);
  return Number.isNaN(time) ? undefined : new Date(time).toISOString();
}

export function httpsUrl(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("//")) return `https:${src}`;
  return src.replace(/^http:\/\//, "https://");
}

const byNewest = (a: Product, b: Product) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");

/**
 * Keep what the site shows for one brand: its newest launches plus its best live promos.
 * Caps keep the snapshot small even for stores with thousands of products.
 */
export function selectForBrand(products: Product[], { newest = 24, promos = 36 } = {}): Product[] {
  const keep = new Map<string, Product>();
  for (const p of [...products].sort(byNewest).slice(0, newest)) keep.set(p.id, p);
  const onSale = products
    .filter((p) => p.discount !== undefined && p.available)
    .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0) || byNewest(a, b));
  for (const p of onSale.slice(0, promos)) keep.set(p.id, p);
  return [...keep.values()];
}
