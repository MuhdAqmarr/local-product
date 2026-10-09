import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import type { CSSProperties } from "react";
import { BadgePercent, Info } from "@/components/ui/lucide";
import { Sparkle } from "@/components/art/sparkle";
import { Starburst } from "@/components/art/starburst";
import { LivePill } from "@/components/feedback/live-pill";
import { LiveTime } from "@/components/feedback/live-time";
import { computeFacets, defaultFilters, groupTotals, PAGE_SIZE, sortItems } from "@/components/listing/listing-model";
import { ProductListing } from "@/components/listing/product-listing";
import { PageTransition } from "@/components/motion/page-transition";
import { Accent } from "@/components/ui/section-header";
import { getPromos, getStats } from "@/lib/catalog";
import { formatCount } from "@/lib/format";

export const metadata: Metadata = pageMetadata({
  title: "Promo panas",
  description: "Produk jenama lokal yang tengah promo, terus dari kedai rasmi. Harga disemak lebih kurang setiap 3 jam.",
  socialDescription: "Produk jenama lokal yang tengah promo, terus dari kedai rasmi.",
  path: "/promos",
});

export default async function PromosPage() {
  const [stats, promos] = await Promise.all([getStats(), getPromos()]);
  const defaults = defaultFilters("promos");
  const sorted = sortItems(promos, defaults.susun);
  const brands = new Set(promos.map((p) => p.brand)).size;
  const maxDiscount = promos.reduce((max, p) => Math.max(max, p.discount ?? 0), 0);

  const head = (
    <div className="relative">
      <div className="min-w-0 pr-[104px] md:pr-[200px]">
        <p className="mb-2 flex items-center gap-1.5 text-overline uppercase text-ink">
          <BadgePercent aria-hidden size={16} /> Harga turun
        </p>
        <h1 className="text-title-1 text-ink">
          Promo <Accent>panas</Accent>
        </h1>
        <p className="mt-2 max-w-[52ch] text-body text-ink-2">
          <span className="font-num text-ink">{formatCount(promos.length)}</span> produk tengah promo dari{" "}
          <span className="font-num text-ink">{formatCount(brands)}</span> jenama. Terus dari kedai rasmi.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <LivePill syncedAt={stats.syncedAt} source={stats.source} liveBrands={stats.liveBrands} brands={stats.brands} promos={stats.promos} watch />
      </div>
      <p className="mt-3 flex max-w-[60ch] items-start gap-1.5 text-caption text-ink-2">
        <Info aria-hidden size={14} strokeWidth={2.25} className="mt-[3px] shrink-0" />
        <span>
          Harga disemak <LiveTime iso={stats.syncedAt} />. Confirm kat kedai rasmi sebelum bayar ya.
        </span>
      </p>

      {maxDiscount > 0 && (
        <div
          className="absolute -right-1 -top-1 grid size-[104px] animate-slap place-items-center md:right-4 md:top-0 md:size-[168px]"
          style={{ "--r": "-8deg", "--r-from": "-24deg", animationDelay: "120ms" } as CSSProperties}
        >
          <Starburst size={168} className="absolute inset-0 size-full" />
          <span className="relative flex flex-col items-center leading-none text-ink">
            <span className="font-hand text-[15px] md:text-[22px]">sampai</span>
            <span className="font-num text-[28px] md:text-[46px]">−{maxDiscount}%</span>
          </span>
          <Sparkle size={18} className="absolute -left-2 bottom-3 md:-left-3 md:size-6" />
        </div>
      )}
    </div>
  );

  return (
    <PageTransition>
      <ProductListing
        kind="promos"
        endpoint="/api/feed/promos"
        tone="mangga-lassi"
        head={head}
        initial={sorted.slice(0, PAGE_SIZE)}
        total={sorted.length}
        initialGroupTotals={groupTotals("promos", sorted, defaults.susun)}
        initialFacets={computeFacets(promos, defaults, stats.syncedAt)}
        syncedAt={stats.syncedAt}
      />
    </PageTransition>
  );
}
