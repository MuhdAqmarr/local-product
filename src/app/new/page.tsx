import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { Sparkle } from "@/components/art/sparkle";
import { WauBulan } from "@/components/art/wau-bulan";
import { LivePill } from "@/components/feedback/live-pill";
import { computeFacets, defaultFilters, groupTotals, PAGE_SIZE, sortItems } from "@/components/listing/listing-model";
import { ProductListing } from "@/components/listing/product-listing";
import { PageTransition } from "@/components/motion/page-transition";
import { Accent } from "@/components/ui/section-header";
import { getNewLaunches, getStats } from "@/lib/catalog";
import { formatCount } from "@/lib/format";
import { NEW_WINDOW_DAYS } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Baru sampai",
  description: "Produk yang baru launch kat kedai rasmi jenama lokal, dikumpul ikut hari. Disemak lebih kurang setiap 3 jam.",
  openGraph: { title: "Baru sampai · LokalLah!", description: "Produk yang baru launch kat kedai rasmi jenama lokal." },
};

export default async function NewPage() {
  const [stats, launches] = await Promise.all([getStats(), getNewLaunches()]);
  const defaults = defaultFilters("new");
  const sorted = sortItems(launches, defaults.susun);
  const brands = new Set(launches.map((p) => p.brand)).size;

  const head = (
    <div className="relative">
      <div className="min-w-0 pr-[84px] md:pr-[180px]">
        <p className="mb-2 flex items-center gap-1.5 text-overline uppercase text-ink">
          <Sparkles aria-hidden size={16} /> Launch baru
        </p>
        <h1 className="text-title-1 text-ink">
          Baru <Accent>sampai</Accent>
        </h1>
        <p className="mt-2 max-w-[52ch] text-body text-ink-2">
          Produk yang baru launch kat kedai rasmi jenama lokal.{" "}
          <span className="font-num text-ink">{formatCount(launches.length)}</span> produk dari{" "}
          <span className="font-num text-ink">{formatCount(brands)}</span> jenama dalam {NEW_WINDOW_DAYS} hari terakhir.
        </p>
      </div>
      <div className="mt-4">
        <LivePill syncedAt={stats.syncedAt} source={stats.source} liveBrands={stats.liveBrands} brands={stats.brands} watch />
      </div>
      <div aria-hidden className="pointer-events-none absolute -right-1 -top-2 md:right-6 md:-top-3">
        <WauBulan size={76} className="md:hidden" />
        <WauBulan size={124} className="hidden md:block" />
        <Sparkle size={16} className="absolute -left-3 top-6 md:-left-6 md:top-10 md:size-6" />
      </div>
    </div>
  );

  return (
    <PageTransition>
      <ProductListing
        kind="new"
        endpoint="/api/feed/new"
        tone="cendol"
        head={head}
        initial={sorted.slice(0, PAGE_SIZE)}
        total={sorted.length}
        initialGroupTotals={groupTotals("new", sorted, defaults.susun)}
        initialFacets={computeFacets(launches, defaults, stats.syncedAt)}
        syncedAt={stats.syncedAt}
      />
    </PageTransition>
  );
}
