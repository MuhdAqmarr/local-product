import { NextResponse, type NextRequest } from "next/server";
import brands from "@/data/brands.json";
import { CATEGORIES } from "@/lib/taxonomy";

/**
 * Real 404s for unknown brand/category slugs.
 *
 * With Cache Components + Partial Prefetching, the slug pages await `params` inside <Suspense>, so
 * by the time `notFound()` runs the static shell has already been sent with HTTP 200 (a soft 404).
 * `dynamicParams = false` is not available under Cache Components, so we check the slug here
 * against the same static lists `generateStaticParams` uses and rewrite misses to a path no route
 * matches, which renders `app/not-found.tsx` with a real 404 status. Known slugs pass straight
 * through to their prerendered pages.
 */
const BRAND_SLUGS = new Set((brands as Array<{ slug: string }>).map((b) => b.slug));
const CATEGORY_SLUGS = new Set<string>(CATEGORIES.map((c) => c.slug));
const MISSING = "/_lokallah/not-found";

export function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split("/");
  const known = section === "brands" ? BRAND_SLUGS : CATEGORY_SLUGS;
  if (slug && !known.has(safeDecode(slug))) {
    return NextResponse.rewrite(new URL(MISSING, request.url));
  }
  return NextResponse.next();
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export const config = {
  matcher: ["/brands/:slug", "/categories/:slug"],
};
