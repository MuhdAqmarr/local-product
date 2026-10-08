import { RailStagger } from "@/components/motion/rail-stagger";
import { RailControls } from "@/components/rail/rail-controls";
import { SectionHeader } from "@/components/ui/section-header";
import type { BrandSummary } from "@/lib/catalog";
import type { Brand } from "@/lib/types";
import { BrandCard } from "./brand-card";

const MAX = 10;

/**
 * Same category first (same tier ahead of the others), then the same tier elsewhere if the aisle
 * is short. Within a group: brands with a live store, then more promos, then A–Z. Deterministic.
 */
export function pickSimilar(brand: Pick<Brand, "slug" | "category" | "tier">, all: BrandSummary[]): BrandSummary[] {
  const score = (b: BrandSummary) => (b.category === brand.category ? 0 : 2) + (b.tier === brand.tier ? 0 : 1);
  return all
    .filter((b) => b.slug !== brand.slug && (b.category === brand.category || b.tier === brand.tier))
    .sort((a, b) => score(a) - score(b) || Number(b.live) - Number(a.live) || b.promoCount - a.promoCount || a.name.localeCompare(b.name))
    .slice(0, MAX);
}

/** "Jenama serupa yang kau mungkin suka" (DESIGN §8.5 #9): a horizontal rail of kedai cards. */
export function SimilarBrands({ brands }: { brands: BrandSummary[] }) {
  if (!brands.length) return null;
  const trackId = "jenama-serupa-track";
  return (
    <section aria-labelledby="jenama-serupa" className="mt-(--section-y)">
      <div className="container-page">
        <SectionHeader id="jenama-serupa" title="Jenama serupa yang kau mungkin suka" sub="Dari rak yang sama, saiz yang sama dulu." aside={<RailControls trackId={trackId} />} />
      </div>
      <div className="mx-auto max-w-(--container)">
        <RailStagger
          id={trackId}
          label="Jenama serupa, skrol mendatar"
          className="no-scrollbar grid auto-cols-[min(78vw,272px)] grid-flow-col gap-4 overflow-x-auto overscroll-x-contain scroll-px-(--gutter) px-(--gutter) pt-4 pb-6 snap-x snap-mandatory focus-visible:outline-offset-[-3px]"
          itemClassName="snap-start min-w-0 flex"
        >
          {brands.map((b) => (
            <BrandCard key={b.slug} brand={b} morph prefetch={false} />
          ))}
        </RailStagger>
      </div>
    </section>
  );
}
