import type { Metadata } from "next";
import { Store } from "@/components/ui/lucide";
import { Seal } from "@/components/art/seal";
import { DirectoryFilter, type DirectoryBrand, type DirectoryFacets } from "@/components/brand/directory-filter";
import { letterOf } from "@/components/brand/directory-letter";
import { packPreview } from "@/components/brand/preview-url";
import { RandomBrandButton } from "@/components/brand/random-brand-button";
import { LivePill } from "@/components/feedback/live-pill";
import { Odometer } from "@/components/feedback/odometer";
import { PageTransition } from "@/components/motion/page-transition";
import { Band } from "@/components/ui/band";
import { Accent } from "@/components/ui/section-header";
import { getBrandSummaries, getStats, type BrandSummary } from "@/lib/catalog";
import { normalizeText } from "@/lib/search";
import { MessagesProvider } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { rich } from "@/i18n/rich";
import { dictionaryFor, getDictionary, getLocale, getMessages } from "@/i18n/server";
import { brandDescription } from "@/lib/brands";
import { pageMetadata } from "@/lib/site";
import { CATEGORIES, CATEGORY_BY_SLUG, STATES } from "@/lib/taxonomy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = dictionaryFor(locale).brands.meta;
  return pageMetadata({ locale, title: t.title, description: t.description, path: "/brands" });
}

/** Search text matches the category in both languages, whichever page you are on. */
function haystack(b: BrandSummary): string {
  const c = CATEGORY_BY_SLUG[b.category];
  return normalizeText([b.name, b.subcategory.replace(/-/g, " "), c.name, c.nameShort, c.nameMs, b.origin ?? "", ...b.tags].join(" "));
}

export default async function BrandsPage() {
  const [stats, brands, locale, dict, messages] = await Promise.all([getStats(), getBrandSummaries(), getLocale(), getDictionary(), getMessages("brands")]);
  const t = dict.brands.directory;

  const facets: DirectoryFacets = {
    total: brands.length,
    categories: CATEGORIES.map((c) => ({ slug: c.slug, count: brands.filter((b) => b.category === c.slug).length })).filter((c) => c.count > 0),
    states: STATES.filter((st) => brands.some((b) => b.state === st)),
    letters: [...new Set(brands.map((b) => letterOf(b.name)))].sort((a, b) => (a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b))),
  };

  // Slim, serialisable card data (+ search text) for the client directory. Previews are capped at
  // the 3 thumbs a card shows and packed (Shopify prefix stripped); the A–Z letter is derived client-side.
  const list: DirectoryBrand[] = brands.map((b) => ({
    slug: b.slug,
    name: b.name,
    category: b.category,
    tier: b.tier,
    description: brandDescription(b, locale),
    state: b.state,
    hasFeed: b.hasFeed,
    live: b.live,
    promoCount: b.promoCount,
    newCount: b.newCount,
    previews: b.previews.slice(0, 3).map(packPreview),
    hay: haystack(b),
  }));

  return (
    <PageTransition>
      <Band as="header" tone="bandung-fizz" className="mt-3 md:mt-5">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="mb-2 flex items-center gap-1.5 text-overline text-ink uppercase">
              <Store aria-hidden size={16} /> {t.eyebrow}
            </p>
            <h1 className="text-title-1 text-ink">{rich(t.title, { accent: <Accent>{t.titleAccent}</Accent> })}</h1>
            <p className="mt-2 max-w-[56ch] text-body text-ink-2">
              {rich(t.sub, { count: <Odometer value={brands.length} className="font-num text-ink" /> })} {fmt(t.subLive, { live: stats.liveBrands })}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
              <RandomBrandButton slugs={brands.map((b) => b.slug)} size="sm" />
              <LivePill syncedAt={stats.syncedAt} source={stats.source} liveBrands={stats.liveBrands} brands={stats.brands} size="sm" />
            </div>
          </div>
          <Seal size={96} className="mt-1 hidden shrink-0 rotate-[8deg] md:block" />
        </div>
      </Band>

      <div className="container-page pb-(--section-y)">
        <MessagesProvider messages={messages}>
          <DirectoryFilter brands={list} facets={facets} />
        </MessagesProvider>
      </div>
    </PageTransition>
  );
}
