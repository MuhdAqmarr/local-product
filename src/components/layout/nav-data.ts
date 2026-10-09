import type { CategorySlug, TierSlug } from "@/lib/types";

/** Slim, serialisable data the header/sheet/footer need (computed on the server). */
export interface NavCategory {
  slug: CategorySlug;
  /** Category label in the page language (`categoryLabel(slug, locale)`). */
  label: string;
  brands: number;
  promos: number;
}

export interface NavTier {
  slug: TierSlug;
  name: string;
}
