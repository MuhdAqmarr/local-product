import type { MetadataRoute } from "next";
import { LOCALES, localeHref } from "@/i18n/config";
import { BRANDS } from "@/lib/brands";
import { getStats } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";
import { CATEGORIES } from "@/lib/taxonomy";

/** Absolute origin (one source of truth: `lib/site.ts`). */
export function siteOrigin(): string {
  return SITE_URL;
}

type Entry = Omit<MetadataRoute.Sitemap[number], "url" | "alternates"> & { path: string };

/**
 * Every page in both languages (English unprefixed, Malay under /ms), each entry listing its
 * translations in `alternates.languages` (+ x-default → English) so search engines pair them.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  // Live pages change with every catalog sync; use its time (never the request clock).
  const { syncedAt } = await getStats();
  const lastModified = new Date(syncedAt);

  const entries: Entry[] = [
    { path: "/", lastModified, changeFrequency: "hourly", priority: 1 },
    { path: "/promos", lastModified, changeFrequency: "hourly", priority: 0.9 },
    { path: "/new", lastModified, changeFrequency: "hourly", priority: 0.9 },
    { path: "/brands", lastModified, changeFrequency: "daily", priority: 0.8 },
    { path: "/about", changeFrequency: "monthly", priority: 0.4 },
    ...CATEGORIES.map((c): Entry => ({ path: `/categories/${c.slug}`, lastModified, changeFrequency: "hourly", priority: 0.7 })),
    ...BRANDS.map(
      (b): Entry => ({
        path: `/brands/${b.slug}`,
        lastModified: b.feed ? lastModified : undefined,
        changeFrequency: b.feed ? "daily" : "monthly",
        priority: 0.6,
      }),
    ),
  ];

  const abs = (path: string) => `${origin}${path === "/" ? "/" : path}`;
  return entries.flatMap(({ path, ...rest }) => {
    const languages = {
      ...Object.fromEntries(LOCALES.map((l) => [l, abs(localeHref(l, path))])),
      "x-default": abs(localeHref("en", path)),
    };
    return LOCALES.map((l) => ({ url: abs(localeHref(l, path)), ...rest, alternates: { languages } }));
  });
}
