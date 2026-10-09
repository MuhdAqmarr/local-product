import { NextResponse, type NextRequest } from "next/server";
import brands from "@/data/brands.json";
import { DEFAULT_LOCALE, LOCALE_COOKIE, stripLocale } from "@/i18n/config";
import { CATEGORIES } from "@/lib/taxonomy";

/**
 * Locale routing (docs/I18N.md) + real 404s for unknown paths.
 *
 * Locales: every page lives under `app/[lang]/`. English is unprefixed in the browser:
 * - `/promos`            → rewrite to `/en/promos` (the browser never sees `/en`)
 * - `/en`, `/en/promos`  → 308 to `/`, `/promos` (one canonical URL per page)
 * - `/ms/...`            → passes through
 * - bare `/` with the `lokallah-lang=ms` cookie → redirect to `/ms` (only the home page; every
 *   other URL is honoured as-is so shared links open in the language they were shared in)
 *
 * 404s: with Cache Components + Partial Prefetching a `notFound()` inside <Suspense> (unknown slugs)
 * or in the `[...missing]` catch-all ships the static shell with HTTP 200 (a soft 404). So the proxy
 * knows every page path: anything else (unknown brand/category slugs, typos) is rewritten to
 * `/{lang}/_lokallah/not-found` with a real 404 status, which renders the localized `not-found.tsx`.
 * ADDING A PAGE? Add its language-neutral path to `PAGES` (or the slug rules in `isPage`).
 */
const BRAND_SLUGS = new Set((brands as Array<{ slug: string }>).map((b) => b.slug));
const CATEGORY_SLUGS = new Set<string>(CATEGORIES.map((c) => c.slug));
const PAGES = new Set(["/", "/promos", "/new", "/brands", "/saved", "/about", "/opengraph-image", "/twitter-image"]);
const MISSING = "/_lokallah/not-found";

/** Metadata image routes inside [lang] (og/twitter cards): served as-is, never redirected. */
const IMAGE_ROUTE = /\/(opengraph-image|twitter-image)$/;

/** Is `path` (language-neutral) a page or image route that exists? */
function isPage(path: string): boolean {
  if (PAGES.has(path)) return true;
  const [, section, slug, extra, more] = path.split("/");
  if (!slug || more !== undefined) return false;
  if (section === "brands") return BRAND_SLUGS.has(safeDecode(slug)) && (extra === undefined || extra === "opengraph-image" || extra === "twitter-image");
  if (section === "categories") return CATEGORY_SLUGS.has(safeDecode(slug)) && extra === undefined;
  return false;
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;
  const { locale, path } = stripLocale(pathname);
  const prefixed = path !== pathname;

  // /en/... → canonical unprefixed URL. Image routes Next itself links as /en/... are exempt.
  if (prefixed && locale === DEFAULT_LOCALE && !IMAGE_ROUTE.test(pathname)) {
    const target = url.clone();
    target.pathname = path;
    return NextResponse.redirect(target, 308);
  }

  // Remembered Bahasa Melayu: only the bare home page follows the cookie.
  if (pathname === "/" && request.cookies.get(LOCALE_COOKIE)?.value === "ms") {
    const target = url.clone();
    target.pathname = "/ms";
    return NextResponse.redirect(target, 307);
  }

  // Unknown paths (typos, unknown brand/category slugs), in either language → real 404.
  if (!isPage(path)) {
    const target = url.clone();
    target.pathname = `/${locale}${MISSING}`;
    return NextResponse.rewrite(target, { status: 404 });
  }

  if (prefixed) return NextResponse.next();

  const target = url.clone();
  target.pathname = path === "/" ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${path}`;
  return NextResponse.rewrite(target);
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export const config = {
  // Everything except Next/Vercel internals (and dev endpoints), API routes, root icon routes and the
  // app-root files (favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest). There is no public/
  // folder, so any other dotted path (/x.html, /promos.old, /ms/brands/a.b) goes through isPage()
  // and gets the branded, localized 404 with a real 404 status. ADDING A STATIC FILE? List it here.
  matcher: ["/((?!_next/|_vercel/|__nextjs|api/|icon(?:/|$)|apple-icon(?:/|$)|(?:favicon\\.ico|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest)$).*)"],
};
