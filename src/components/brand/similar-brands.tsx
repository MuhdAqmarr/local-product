import { RailStagger } from "@/components/motion/rail-stagger";
import { RailControls } from "@/components/rail/rail-controls";
import { SectionHeader } from "@/components/ui/section-header";
import type { BrandSummary } from "@/lib/catalog";
import type { Brand } from "@/lib/types";
import { BrandCard } from "./brand-card";
import { fmt } from "@/i18n/format";
import { getDictionary, getLocale } from "@/i18n/server";

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

/**
 * "Similar brands you might like" (DESIGN §8.5 #9): a horizontal rail of kedai cards.
 * Pass descriptions already localised (`brandDescription(brand, locale)`).
 */
export async function SimilarBrands({ brands }: { brands: BrandSummary[] }) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.brands.similar;
  if (!brands.length) return null;
  const trackId = "jenama-serupa-track";
  return (
    <section aria-labelledby="jenama-serupa" className="mt-(--section-y)">
      <div className="container-page">
        <SectionHeader id="jenama-serupa" title={t.title} sub={t.sub} aside={<RailControls trackId={trackId} />} />
      </div>
      <div className="mx-auto max-w-(--container)">
        <RailStagger
          id={trackId}
          label={fmt(dict.common.rail.region, { title: t.title })}
          className="no-scrollbar grid auto-cols-[min(78vw,272px)] grid-flow-col gap-4 overflow-x-auto overscroll-x-contain scroll-px-(--gutter) px-(--gutter) pt-4 pb-6 snap-x snap-mandatory focus-visible:outline-offset-[-3px]"
          itemClassName="snap-start min-w-0 flex"
        >
          {brands.map((b) => (
            <BrandCard locale={locale} key={b.slug} brand={b} morph prefetch={false} />
          ))}
        </RailStagger>
      </div>
    </section>
  );
}
