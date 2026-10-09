import type { CSSProperties } from "react";
import { Link } from "@/i18n/link";
import { ArrowLeft, ArrowUpRight, CalendarHeart, MapPin, RefreshCwOff } from "@/components/ui/lucide";
import { Oyen } from "@/components/art/oyen";
import { CategoryChip } from "@/components/category/category-chip";
import { LivePill } from "@/components/feedback/live-pill";
import { Odometer } from "@/components/feedback/odometer";
import { outboundUrl } from "@/lib/format";
import type { BrandsMessages } from "@/i18n/dictionaries/en/brands";
import type { Brand, FeedStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BrandDescription } from "./brand-description";
import { BrandLinks } from "./brand-links";
import { Monogram } from "./monogram";
import { SaveBrandButton } from "./save-brand-button";
import { ShareBrandButton } from "./share-brand-button";
import { TierCop } from "./tier-cop";
import { TierStamp } from "./tier-stamp";
import { fmt, pluralForm } from "@/i18n/format";
import { rich } from "@/i18n/rich";
import { getDictionary, getLocale } from "@/i18n/server";
import { brandDescription } from "@/lib/brands";
import { NEW_WINDOW_DAYS } from "@/lib/taxonomy";

export interface BrandHeroStats {
  promos: number;
  /** Launched within NEW_WINDOW_DAYS of the last sync and still in stock. */
  fresh: number;
  maxDiscount: number;
  /** Products read in the last sync. */
  products: number;
}

export interface BrandHeroProps {
  brand: Brand;
  syncedAt: string;
  status?: FeedStatus;
  stats: BrandHeroStats;
}

/**
 * Brand profile hero (DESIGN §8.5 #1–5, #8): category cover with awning + batik, back / share /
 * save, identity card (96 px morphing monogram, H1, rotating tier stamp, meta, description, tags,
 * outbound actions, live line) and, on desktop, a stats card with odometers. Brands without a
 * readable store get an honest "can't sync yet" panel in place of the stats.
 */
export async function BrandHero({ brand, syncedAt, status, stats }: BrandHeroProps) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.brands.profile;
  const description = brandDescription(brand, locale);
  const hasFeed = Boolean(brand.feed);
  const hasProducts = hasFeed && stats.products > 0;
  const savedBrand = { slug: brand.slug, name: brand.name, category: brand.category, tier: brand.tier };
  const where = brand.origin ?? brand.state;

  return (
    <section data-cat={brand.category} data-tier={brand.tier} aria-labelledby="brand-name">
      {/* 1. Cover */}
      <div className="relative h-44 overflow-hidden bg-cover-cat lg:h-[220px]">
        <span className="batik" style={{ "--pat-o": 0.3 } as CSSProperties} aria-hidden="true" />
        <div className="awning-wrap absolute inset-x-0 top-0 border-t-0" aria-hidden="true">
          <div className="awning" style={{ "--awning": "var(--cat-pop)", "--awning-h": "22px" } as CSSProperties} />
        </div>
        <div className="container-page relative flex items-start justify-between gap-3 pt-8 lg:pt-12">
          <Link
            href="/brands"
            transitionTypes={["nav-back"]}
            className="group inline-flex h-11 items-center gap-1.5 rounded-full border-2 border-ink bg-putih pr-4 pl-3 text-label text-ink shadow-pop-sm transition-transform duration-150 active:translate-x-0.5 active:translate-y-0.5"
          >
            <ArrowLeft aria-hidden size={18} strokeWidth={2.5} className="transition-transform duration-200 group-hover:-translate-x-[3px]" />
            {t.back}
          </Link>
          <div className="flex items-center gap-2.5">
            <ShareBrandButton name={brand.name} text={`${brand.name}: ${description}`} />
            <SaveBrandButton brand={savedBrand} tone="solid" />
          </div>
        </div>
      </div>

      <div className="container-page">
        <div className={cn("relative -mt-12 grid items-start gap-5", "lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6")}>
          {/* 2. Identity card */}
          <div className="relative rounded-card-lg border-2 border-ink bg-putih p-5 shadow-pop md:p-7">
            <div className="kedai-id-stamp absolute -top-11 -right-2 scale-[.78] sm:-top-12 sm:right-3 sm:scale-90 lg:scale-100">
              <TierStamp tier={brand.tier} />
            </div>
            <div className="-mt-[60px] md:-mt-[76px]">
              <Monogram slug={brand.slug} name={brand.name} category={brand.category} size={96} morph className="drop-shadow-[0_3px_0_rgb(43_23_54_/_0.16)]" />
            </div>

            <h1 id="brand-name" className="mt-3 pr-2 text-title-1 [overflow-wrap:anywhere] text-ink">
              {brand.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <TierCop locale={locale} tier={brand.tier} size="lg" />
              <CategoryChip category={brand.category} href={`/categories/${brand.category}`} dense />
              {where && (
                <span className="inline-flex items-center gap-1 text-body-sm text-ink-soft">
                  <MapPin aria-hidden size={16} strokeWidth={2.25} className="shrink-0" />
                  {where}
                </span>
              )}
              {brand.founded && (
                <span className="inline-flex items-center gap-1 text-body-sm text-ink-soft">
                  <CalendarHeart aria-hidden size={16} strokeWidth={2.25} className="shrink-0" />
                  {fmt(t.since, { year: String(brand.founded) })}
                </span>
              )}
            </div>

            <BrandDescription text={description} className="mt-4" />

            {brand.tags.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t.tags}>
                {brand.tags.map((tag) => (
                  <li key={tag} className="inline-flex h-7 items-center rounded-full bg-kapas px-2.5 text-label-sm text-ink-2">
                    <span aria-hidden className="mr-0.5 text-ink-soft">
                      #
                    </span>
                    {(t.tagLabels as Record<string, string>)[tag] ?? tag}
                  </li>
                ))}
              </ul>
            )}

            {/* 3. Actions */}
            <BrandLinks brand={brand} locale={locale} className="mt-5" />

            {/* 4. Live line */}
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t-2 border-dashed border-garis pt-4">
              <LivePill syncedAt={syncedAt} brand={{ name: brand.name, hasFeed, status }} size="sm" />
              {hasProducts && (
                <p className="text-body-sm text-ink-2">
                  {rich(pluralForm(stats.promos, t.promoCount), { count: <span className="font-num text-ink">{stats.promos}</span> })} ·{" "}
                  {rich(pluralForm(stats.fresh, t.newCount), { count: <span className="font-num text-ink">{stats.fresh}</span> })}
                </p>
              )}
            </div>
          </div>

          {/* 5. Desktop stats, or 8. the no-feed panel (stacks under the card on phones) */}
          {hasProducts ? (
            <aside data-reveal="" aria-label={fmt(t.statsLabel, { brand: brand.name })} className="hidden rounded-card-lg border-2 border-ink bg-putih p-6 shadow-pop lg:block">
              <p className="text-overline text-ink-soft uppercase">{t.statsTitle}</p>
              <dl className="mt-4 grid gap-3">
                <Stat label={t.statPromos} tone="bg-bandung-tint text-bandung-pekat">
                  <Odometer value={stats.promos} roll="reveal" />
                </Stat>
                <Stat label={fmt(t.statNew, { days: NEW_WINDOW_DAYS })} tone="bg-pandan-tint text-pandan-pekat">
                  <Odometer value={stats.fresh} roll="reveal" />
                </Stat>
                <Stat label={t.statMax} tone="bg-mangga-tint text-kunyit-pekat">
                  {stats.maxDiscount > 0 ? <Odometer value={stats.maxDiscount} suffix="%" roll="reveal" srText={`${stats.maxDiscount}%`} /> : <span className="text-ink-soft">–</span>}
                </Stat>
              </dl>
              <p className="mt-4 text-caption text-ink-soft">{fmt(t.statsNote, { count: stats.products })}</p>
            </aside>
          ) : (
            <NoFeedPanel brand={brand} hasFeed={hasFeed} t={t} />
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, tone, children }: { label: string; tone: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex items-center justify-between gap-3 rounded-card px-4 py-3", tone)}>
      <dt className="text-label">{label}</dt>
      <dd className="font-num text-[32px] leading-none text-ink">{children}</dd>
    </div>
  );
}

function NoFeedPanel({ brand, hasFeed, t }: { brand: Brand; hasFeed: boolean; t: BrandsMessages["profile"] }) {
  return (
    <aside aria-labelledby="no-feed-title" className="relative overflow-hidden rounded-card-lg border-2 border-ink bg-keladi-tint p-5 shadow-pop md:p-6">
      <div className="flex items-center gap-3">
        <Oyen mood="cari" size={64} className="shrink-0" />
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1 rounded-full bg-putih px-2.5 py-1 text-label-sm text-ink-soft">
            <RefreshCwOff aria-hidden size={14} strokeWidth={2.5} className="shrink-0" />
            {hasFeed ? t.noStockBadge : t.noSyncBadge}
          </p>
          <h2 id="no-feed-title" className="mt-1.5 text-title-3 text-ink">
            {hasFeed ? t.noStockTitle : fmt(t.noSyncTitle, { brand: brand.name })}
          </h2>
        </div>
      </div>
      <p className="mt-3 text-body-sm text-ink-2">
        {hasFeed ? t.noStockBody : t.noSyncBody}{" "}
        {rich(t.noFeedVisit, {
          link: (
            <a href={outboundUrl(brand.website)} target="_blank" rel="noopener noreferrer" className="font-semibold text-telang underline underline-offset-2">
              {t.noFeedLink}
              <ArrowUpRight aria-hidden size={14} strokeWidth={2.5} className="ml-0.5 inline-block -translate-y-px" />
              <span className="sr-only"> {t.newTab}</span>
            </a>
          ),
        })}
      </p>
    </aside>
  );
}
