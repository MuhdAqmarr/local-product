import data from "@/data/brands.json";
import msData from "@/data/brands-ms.json";
import type { Locale } from "@/i18n/config";
import type { Brand, CategorySlug, TierSlug } from "./types";

/** The curated directory, A–Z. Safe to import anywhere on the server. */
export const BRANDS: readonly Brand[] = (data as unknown as Brand[]).slice().sort((a, b) => a.name.localeCompare(b.name));

const BY_SLUG = new Map(BRANDS.map((b) => [b.slug, b]));

export function getBrand(slug: string): Brand | undefined {
  return BY_SLUG.get(slug);
}

export function brandsInCategory(category: CategorySlug): Brand[] {
  return BRANDS.filter((b) => b.category === category);
}

export function brandsInTier(tier: TierSlug): Brand[] {
  return BRANDS.filter((b) => b.tier === tier);
}

/**
 * Malay brand descriptions (`{ "<slug>": "<≤160 chars>" }`). Kept apart from brands.json so
 * `npm run brands` re-runs never overwrite them. Server-only by convention: it is ~30 KB once
 * filled, so never import this module from a client component.
 */
const BRANDS_MS = msData as Record<string, string | undefined>;

/**
 * A brand's description in the page language: Malay from `src/data/brands-ms.json` when present,
 * else the English one from `brands.json`. Localise on the server and pass the string down.
 */
export function brandDescription(brand: Pick<Brand, "slug" | "description">, locale: Locale): string {
  if (locale === "ms") return BRANDS_MS[brand.slug]?.trim() || brand.description;
  return brand.description;
}
