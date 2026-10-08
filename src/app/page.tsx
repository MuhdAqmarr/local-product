import { Suspense } from "react";
import type { Metadata } from "next";
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
import "@/components/home/home.css";

const TITLE = "LokalLah! — Semua jenama lokal, sentiasa up to date";
const DESCRIPTION =
  "Direktori jenama Malaysia dari Cili Padi ke Jenama Ikon, dengan promo live dan launch baru terus dari kedai rasmi mereka. Auto-update setiap beberapa jam.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "LokalLah!", locale: "ms_MY", title: TITLE, description: DESCRIPTION, url: "/" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const DAY = 86_400_000;

/* ---- Sections (each live section streams in its own Suspense with a shape-exact skeleton) ---- */

async function Ticker() {
  const [stats, promos, launches] = await Promise.all([getStats(), getPromos({ limit: 6 }), getNewLaunches({ limit: 6, perBrand: 1 })]);
  return <LiveTicker promos={promos} launches={launches} syncedAt={stats.syncedAt} />;
}

async function Categories() {
  const [stats, categories] = await Promise.all([getStats(), getCategorySummaries()]);
  return (
    <section aria-labelledby="rak-title" className="container-page">
      <SectionHeader
        id="rak-title"
        eyebrow="Rak kategori"
        title={
          <>
            Nak <Accent>usha</Accent> apa hari ni?
          </>
        }
        sub={`${categories.length} kategori, dari dapur sampai almari.`}
        href="/brands"
        linkLabel="Semua jenama"
      />
      <CategoryShelf categories={categories} allBrands={stats.brands} className="mt-7" />
    </section>
  );
}

async function PromoRail() {
  const [stats, promos] = await Promise.all([getStats(), getPromos({ limit: 12, perBrand: 2 })]);
  if (!promos.length) return null;
  return (
    <Band tone="mangga-lassi" as="div" className="home-band px-0 pt-0 pb-5 md:px-0 md:pt-0 md:pb-7">
      <div aria-hidden className="home-hem" />
      <Rail
        id="promo-panas"
        className="pt-6 md:pt-8"
        title={
          <>
            Promo <Accent>panas</Accent> sekarang
          </>
        }
        titleText="Promo panas sekarang"
        sub="Harga turun, dikesan terus dari kedai rasmi."
        count={stats.promos}
        noun="promo"
        href="/promos"
        hint
      >
        {promos.map((p) => (
          <ProductCard key={p.id} product={p} syncedAt={stats.syncedAt} context="rail" emphasis="promo" />
        ))}
      </Rail>
    </Band>
  );
}

async function BaruRail() {
  const [stats, launches] = await Promise.all([getStats(), getNewLaunches({ limit: 12, perBrand: 2 })]);
  if (!launches.length) return null;
  const sync = Date.parse(stats.syncedAt);
  // Honest overline: "Minggu ni" only when every card really launched within 7 days of the last sync.
  const thisWeek = launches.every((p) => p.publishedAt && sync - Date.parse(p.publishedAt) <= 7 * DAY);
  return (
    <Band tone="cendol" as="div" className="home-band px-0 pt-6 pb-5 md:px-0 md:pt-8 md:pb-7">
      <Rail
        id="baru-sampai"
        title={
          <>
            Baru <Accent>sampai</Accent>
          </>
        }
        titleText="Baru sampai"
        eyebrow={thisWeek ? "Minggu ni" : "Launch terkini"}
        sub="Fresh dari oven: produk yang baru launch."
        art={<WauBulan size={48} />}
        count={stats.newLaunches}
        noun="produk baru"
        href="/new"
      >
        {launches.map((p) => (
          <ProductCard key={p.id} product={p} syncedAt={stats.syncedAt} context="rail" emphasis="baru" />
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
  const [stats, topPromos] = await Promise.all([getStats(), getPromos({ limit: 3, perBrand: 1, order: "ranked" })]);
  const deals = topPromos.length ? topPromos : await getNewLaunches({ limit: 3, perBrand: 1 });

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
