import data from "@/data/brands.json";
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
