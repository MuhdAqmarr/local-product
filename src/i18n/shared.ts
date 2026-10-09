import type { Locale } from "./config";
import en from "./dictionaries/en/common";
import ms from "./dictionaries/ms/common";
import type { CommonMessages } from "./dictionaries/en/common";

/**
 * The `common` namespace by locale, synchronously, for hook-free components that render on both
 * sides (ProductCard, BrandCard, Price, TierCop…). They take a `locale` prop and call
 * `commonFor(locale)`. Client-safe; prefer `useI18n()` in client components and
 * `getDictionary()` in async Server Components.
 */
const COMMON: Record<Locale, CommonMessages> = { en, ms };

export function commonFor(locale: Locale): CommonMessages {
  return COMMON[locale] ?? COMMON.en;
}
