import type { MetadataRoute } from "next";
import { BRANDS } from "@/lib/brands";
import { getStats } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";
import { CATEGORIES } from "@/lib/taxonomy";

/** Absolute origin (one source of truth: `lib/site.ts`). */
export function siteOrigin(): string {
  return SITE_URL;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  // Live pages change with every catalog sync; use its time (never the request clock).
  const { syncedAt } = await getStats();
  const lastModified = new Date(syncedAt);

  const pages: MetadataRoute.Sitemap = [
    { url: `${origin}/`, lastModified, changeFrequency: "hourly", priority: 1 },
    { url: `${origin}/promos`, lastModified, changeFrequency: "hourly", priority: 0.9 },
    { url: `${origin}/new`, lastModified, changeFrequency: "hourly", priority: 0.9 },
    { url: `${origin}/brands`, lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: `${origin}/about`, changeFrequency: "monthly", priority: 0.4 },
  ];
  const categories: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${origin}/categories/${c.slug}`,
    lastModified,
    changeFrequency: "hourly",
    priority: 0.7,
  }));
  const brands: MetadataRoute.Sitemap = BRANDS.map((b) => ({
    url: `${origin}/brands/${b.slug}`,
    lastModified: b.feed ? lastModified : undefined,
    changeFrequency: b.feed ? "daily" : "monthly",
    priority: 0.6,
  }));
  return [...pages, ...categories, ...brands];
}
