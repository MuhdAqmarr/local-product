/**
 * Locale config (docs/I18N.md). Client-safe and dependency-free: import it anywhere.
 *
 * URLs: English is unprefixed (`/promos`), Bahasa Melayu lives under `/ms` (`/ms/promos`).
 * Internally every page sits under `src/app/[lang]/`; `src/proxy.ts` rewrites unprefixed paths to
 * `/en/...` and permanently redirects `/en/...` back to the unprefixed URL.
 */
export const LOCALES = ["en", "ms"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Remembers the visitor's choice (set by LanguageToggle; read by the proxy for the bare home only). */
export const LOCALE_COOKIE = "lokallah-lang";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Short pill label and full name per locale (the toggle reads "EN | BM"). */
export const LOCALE_LABEL: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  ms: { short: "BM", name: "Bahasa Melayu" },
};

export function hasLocale(value: unknown): value is Locale {
  return value === "en" || value === "ms";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "ms" : "en";
}

/** `<html lang>`: "en-MY" / "ms-MY". */
export function htmlLang(locale: Locale): string {
  return locale === "ms" ? "ms-MY" : "en-MY";
}

/** Open Graph locale: "en_MY" / "ms_MY". */
export function ogLocale(locale: Locale): string {
  return locale === "ms" ? "ms_MY" : "en_MY";
}

/** BCP 47 tag for Intl formatters. */
export function intlLocale(locale: Locale): string {
  return htmlLang(locale);
}

/**
 * Split a pathname into its locale and the language-neutral path.
 * "/ms/promos" → { locale: "ms", path: "/promos" } · "/promos" and "/en/promos" → { locale: "en", path: "/promos" }.
 */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const match = /^\/(en|ms)(?=\/|$)(.*)$/.exec(pathname);
  if (!match) return { locale: DEFAULT_LOCALE, path: pathname || "/" };
  return { locale: match[1] as Locale, path: match[2] || "/" };
}

/**
 * The public URL of an internal page in `locale`. Accepts a path with optional query and hash
 * ("/brands?tier=ikon", "/about#sync"); an already-prefixed path is re-targeted.
 * External URLs, protocol-relative URLs, bare hashes/queries and `/api/*` pass through untouched.
 *
 *   localeHref("en", "/promos")  → "/promos"
 *   localeHref("ms", "/promos")  → "/ms/promos"
 *   localeHref("ms", "/")        → "/ms"
 *   localeHref("ms", "/about#sync") → "/ms/about#sync"
 */
export function localeHref(locale: Locale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//") || href === "/api" || href.startsWith("/api/")) return href;
  const cut = href.search(/[?#]/);
  const pathname = cut === -1 ? href : href.slice(0, cut);
  const rest = cut === -1 ? "" : href.slice(cut);
  const { path } = stripLocale(pathname);
  if (locale === DEFAULT_LOCALE) return `${path}${rest}`;
  return `${path === "/" ? `/${locale}` : `/${locale}${path}`}${rest}`;
}

/**
 * `alternates.languages` for a language-neutral path: { en, ms, "x-default": en }.
 * Relative URLs; `metadataBase` (root layout) makes them absolute.
 */
export function languageAlternates(path: string): Record<Locale | "x-default", string> {
  return { en: localeHref("en", path), ms: localeHref("ms", path), "x-default": localeHref("en", path) };
}
