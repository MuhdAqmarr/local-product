import type { Metadata } from "next";
import { languageAlternates, localeHref, ogLocale, otherLocale, type Locale } from "@/i18n/config";
import enMeta from "@/i18n/dictionaries/en/meta";
import msMeta from "@/i18n/dictionaries/ms/meta";

/**
 * Canonical site origin. NEXT_PUBLIC_SITE_URL wins when set; on Vercel we fall back to the
 * project's production domain (a system env var available at build and runtime).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://lokallah.vercel.app")
).replace(/\/+$/, "");

export const SITE_NAME = "LokalLah!";

/** Who made LokalLah! (footer credit, metadata authors/creator/publisher). */
export const MAKER = { name: "MaqmarX", url: "https://maqmarx.vercel.app" } as const;

/* ---- Social metadata (QA F10 + docs/I18N.md) ----
 * A page's `openGraph` / `twitter` object REPLACES the layout's wholesale, so every page that sets
 * its own title/description must carry the image, card, locale and alternates again. Build page
 * metadata with `pageMetadata({ locale, … })` instead of writing bare objects.
 * A route with its own opengraph-image.tsx / twitter-image.tsx (brand pages) passes
 * `defaultImage: false` so the file convention wins.
 */
export const OG_SIZE = { width: 1200, height: 630 };

const META: Record<Locale, typeof enMeta> = { en: enMeta, ms: msMeta };

/** Alt text of the default social card in `locale`. */
export function ogAlt(locale: Locale): string {
  return META[locale].og.alt;
}

/** The localized default Open Graph image ("/opengraph-image" · "/ms/opengraph-image"). */
export function ogImages(locale: Locale) {
  return [{ url: localeHref(locale, "/opengraph-image"), ...OG_SIZE, alt: ogAlt(locale), type: "image/png" }];
}

/** The localized default Twitter image. */
export function twitterImages(locale: Locale) {
  return [{ url: localeHref(locale, "/twitter-image"), ...OG_SIZE, alt: ogAlt(locale), type: "image/png" }];
}

/** Open Graph basics for `locale` without images (spread, then add title/description/url). */
export function ogBase(locale: Locale) {
  return { type: "website" as const, siteName: SITE_NAME, locale: ogLocale(locale), alternateLocale: [ogLocale(otherLocale(locale))] };
}

export interface PageMetadataInput {
  /** The page language (`await getLocale()` in generateMetadata). */
  locale: Locale;
  /** Page title (goes through the layout's "%s · LokalLah!" template unless `absolute`). */
  title: string;
  description: string;
  /** Language-neutral path, e.g. "/promos" (the helper adds "/ms" for Malay). */
  path: string;
  /** Social card title (defaults to "{title} · LokalLah!", or the title itself when `absolute`). */
  socialTitle?: string;
  /** Shorter description for social cards (defaults to `description`). */
  socialDescription?: string;
  /** Use the title as-is (no template), e.g. for Home. */
  absolute?: boolean;
  /** false = the route has its own opengraph-image / twitter-image files; don't set images. */
  defaultImage?: boolean;
  /** Extra fields merged last (e.g. `robots`). */
  extra?: Metadata;
}

/**
 * Everything one page needs, per language: title, description, canonical (its own URL),
 * `alternates.languages` ({ en, ms, x-default }), Open Graph (locale + alternateLocale + url +
 * localized default image) and a large Twitter card.
 *
 *   export async function generateMetadata(): Promise<Metadata> {
 *     const locale = await getLocale();
 *     const t = dictionaryFor(locale).meta;
 *     return pageMetadata({ locale, title: t.promos.title, description: t.promos.description, path: "/promos" });
 *   }
 */
export function pageMetadata({ locale, title, description, path, socialTitle, socialDescription, absolute, defaultImage = true, extra }: PageMetadataInput): Metadata {
  const social = socialTitle ?? (absolute ? title : `${title} · ${SITE_NAME}`);
  const desc = socialDescription ?? description;
  const url = localeHref(locale, path);
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: { ...ogBase(locale), title: social, description: desc, url, ...(defaultImage ? { images: ogImages(locale) } : null) },
    twitter: { card: "summary_large_image", title: social, description: desc, ...(defaultImage ? { images: twitterImages(locale) } : null) },
    ...extra,
  };
}
