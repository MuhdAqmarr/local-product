import { Suspense } from "react";
import type { Metadata } from "next";
import { fmt } from "@/i18n/format";
import { rich } from "@/i18n/rich";
import { dictionaryFor, getDictionary, getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/site";
import { WauBulan } from "@/components/art/wau-bulan";
import { CategoryShelf } from "@/components/category/category-shelf";
import { Explainer } from "@/components/home/explainer";
import { Hero } from "@/components/home/hero";
import { LiveTicker } from "@/components/home/live-ticker";
import { pickCiliPadi, Spotlight } from "@/components/home/spotlight";
import { StateChips } from "@/components/home/state-chips";
import { SuggestBand } from "@/components/home/suggest-band";
import { TierJourney } from "@/components/home/tier-journey";
import { ContentIn, PageTransition, SkeletonOut } from "@/components/motion/page-transition";
import { ProductCard } from "@/components/product/product-card";
import { Rail } from "@/components/rail/rail";
import { BrandGridSkeleton, GridSkeleton, RailSkeleton, TileGridSkeleton } from "@/components/skeletons";
import { Band } from "@/components/ui/band";
import { Accent, SectionHeader } from "@/components/ui/section-header";
import { getBrandProducts, getBrandSummaries, getCategorySummaries, getNewLaunches, getPromos, getStats } from "@/lib/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = dictionaryFor(locale).home.meta;
  return pageMetadata({ locale, title: t.title, description: t.description, path: "/", absolute: true });
}

const DAY = 86_400_000;

/** Up to `n` items in rank order, preferring a different brand category per card; tops up by rank if too few. */
function distinctCategories<T extends { id: string; brandCategory: string }>(items: T[], n: number): T[] {
  const picked: T[] = [];
  const seen = new Set<string>();
  for (const it of items) {
    if (picked.length === n) break;
    if (seen.has(it.brandCategory)) continue;
    seen.add(it.brandCategory);
    picked.push(it);
  }
  for (const it of items) {
    if (picked.length === n) break;
    if (!picked.includes(it)) picked.push(it);
  }
  return picked;
}

/* ---- Sections (each live section streams in its own Suspense with a shape-exact skeleton) ---- */

async function Ticker() {
  const [stats, promos, launches] = await Promise.all([getStats(), getPromos({ limit: 6, showcase: true }), getNewLaunches({ limit: 6, perBrand: 1, showcase: true })]);
  return <LiveTicker promos={promos} launches={launches} syncedAt={stats.syncedAt} />;
}

async function Categories() {
  const [stats, categories, t] = await Promise.all([getStats(), getCategorySummaries(), getDictionary()]);
  const c = t.home.categories;
  return (
    <section aria-labelledby="rak-title" className="container-page">
      <SectionHeader
        id="rak-title"
        eyebrow={c.eyebrow}
        title={rich(c.title, { accent: <Accent>{c.accent}</Accent> })}
        sub={fmt(c.sub, { count: categories.length })}
        href="/brands"
        linkLabel={c.link}
      />
      <CategoryShelf categories={categories} allBrands={stats.brands} className="mt-7" />
    </section>
  );
}

async function PromoRail() {
  const [locale, t, stats, promos] = await Promise.all([getLocale(), getDictionary(), getStats(), getPromos({ limit: 12, perBrand: 2, showcase: true })]);
  if (!promos.length) return null;
  const r = t.home.promoRail;
  return (
    <Band tone="mangga-lassi" as="div" className="home-band px-0 pt-0 pb-5 md:px-0 md:pt-0 md:pb-7">
      <div aria-hidden className="home-hem" />
      <Rail
        id="promo-panas"
        className="pt-6 md:pt-8"
        title={rich(r.title, { accent: <Accent>{r.accent}</Accent> })}
        titleText={r.titleText}
        sub={r.sub}
        count={stats.promos}
        noun={r.noun}
        href="/promos"
        hint
      >
        {promos.map((p) => (
          <ProductCard locale={locale} key={p.id} product={p} syncedAt={stats.syncedAt} context="rail" emphasis="promo" />
        ))}
      </Rail>
    </Band>
  );
}

async function BaruRail() {
  const [locale, t, stats, launches] = await Promise.all([getLocale(), getDictionary(), getStats(), getNewLaunches({ limit: 12, perBrand: 2, showcase: true })]);
  if (!launches.length) return null;
  const r = t.home.newRail;
  const sync = Date.parse(stats.syncedAt);
  // Honest overline: "This week" / "Minggu ni" only when every card really launched within 7 days of the last sync.
  const thisWeek = launches.every((p) => p.publishedAt && sync - Date.parse(p.publishedAt) <= 7 * DAY);
  return (
    <Band tone="cendol" as="div" className="home-band px-0 pt-6 pb-5 md:px-0 md:pt-8 md:pb-7">
      <Rail
        id="baru-sampai"
        title={rich(r.title, { accent: <Accent>{r.accent}</Accent> })}
        titleText={r.titleText}
        eyebrow={thisWeek ? r.eyebrowWeek : r.eyebrowLatest}
        sub={r.sub}
        art={<WauBulan size={48} />}
        count={stats.newLaunches}
        noun={r.noun}
        href="/new"
      >
        {launches.map((p) => (
          <ProductCard locale={locale} key={p.id} product={p} syncedAt={stats.syncedAt} context="rail" emphasis="baru" />
        ))}
      </Rail>
    </Band>
  );
}

async function HowWeSync() {
  const [stats, promos] = await Promise.all([getStats(), getPromos({ limit: 300 })]);
  // A real, mid-sized (L2) promo at an everyday price keeps the price-drop demo honest and readable.
  const l2 = (p: (typeof promos)[number], lo: number, hi: number) => Boolean(p.compareAt && p.discount && p.discount >= lo && p.discount <= hi && p.compareAt <= 300);
  const example = promos.find((p) => l2(p, 25, 35)) ?? promos.find((p) => l2(p, 20, 39)) ?? promos.find((p) => p.compareAt);
  return <Explainer liveBrands={stats.liveBrands} example={example} />;
}

async function Tiers() {
  const brands = await getBrandSummaries();
  return <TierJourney brands={brands} />;
}

async function CiliPadiPick() {
  const [stats, brands] = await Promise.all([getStats(), getBrandSummaries()]);
  const brand = pickCiliPadi(brands, stats.syncedAt);
  if (!brand) return null;
  const { newest } = await getBrandProducts(brand.slug);
  return <Spotlight brand={brand} products={newest.filter((p) => p.available).slice(0, 4)} syncedAt={stats.syncedAt} />;
}

async function States() {
  const brands = await getBrandSummaries();
  return <StateChips brands={brands} />;
}

function Section({ children, fallback, className = "mt-(--section-y)" }: { children: React.ReactNode; fallback: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Suspense
        fallback={
          <SkeletonOut>
            <div>{fallback}</div>
          </SkeletonOut>
        }
      >
        <ContentIn>
          <div>{children}</div>
        </ContentIn>
      </Suspense>
    </div>
  );
}

/** Home (DESIGN §8.1). Server pages never read searchParams; the hero is the LCP (text + inline SVG). */
export default async function Home() {
  // Showcase filter (QA F11): no refurbished clearance or outlier prices up front. The "sampai −N%"
  // burst still reads stats.maxDiscount, the true maximum. 12 candidates so the 3 cards can vary.
  const [stats, topPromos] = await Promise.all([getStats(), getPromos({ limit: 12, perBrand: 1, order: "ranked", showcase: true })]);
  const deals = distinctCategories(topPromos.length ? topPromos : await getNewLaunches({ limit: 12, perBrand: 1, showcase: true }), 3);

  return (
    <PageTransition>
      <Hero stats={stats} deals={deals} dealKind={topPromos.length ? "promo" : "baru"} />

      <Section className="" fallback={<div className="mt-6 h-11 bg-ink md:mt-8" />}>
        <Ticker />
      </Section>

      <Section fallback={<div className="container-page"><TileGridSkeleton /></div>}>
        <Categories />
      </Section>

      <Section fallback={<RailSkeleton count={3} />}>
        <PromoRail />
      </Section>

      <Section fallback={<RailSkeleton count={3} line={false} />}>
        <BaruRail />
      </Section>

      <Section fallback={<div className="mx-3 h-[720px] rounded-sheet bg-kapas md:mx-6 md:h-[520px] md:rounded-panel" />}>
        <HowWeSync />
      </Section>

      <Section fallback={<div className="mx-3 h-[900px] rounded-sheet bg-kapas md:mx-6 md:h-[520px] md:rounded-panel" />}>
        <Tiers />
      </Section>

      <Section fallback={<div className="container-page"><BrandGridSkeleton count={1} line={false} /><GridSkeleton count={4} line={false} /></div>}>
        <CiliPadiPick />
      </Section>

      <Section fallback={null}>
        <States />
      </Section>

      <div className="mt-(--section-y)">
        <SuggestBand />
      </div>
    </PageTransition>
  );
}
