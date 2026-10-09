import Link from "next/link";
import { ArrowRight } from "@/components/ui/lucide";
import { TierIcon } from "@/components/art/tier-icon";
import { Monogram } from "@/components/brand/monogram";
import { TIER_COPY, TierCop } from "@/components/brand/tier-cop";
import { Odometer } from "@/components/feedback/odometer";
import { Band } from "@/components/ui/band";
import { SectionHeader } from "@/components/ui/section-header";
import type { BrandSummary } from "@/lib/catalog";
import { TIERS } from "@/lib/taxonomy";
import type { TierSlug } from "@/lib/types";
import { ScrollStations } from "./explainer-progress";

/** The three faces shown per tier: live shops with the most promos first, then A–Z (stable). */
function faces(brands: BrandSummary[]) {
  return [...brands].sort((a, b) => Number(b.live) - Number(a.live) || b.promoCount - a.promoCount || a.name.localeCompare(b.name)).slice(0, 3);
}

function Station({ tier, brands }: { tier: TierSlug; brands: BrandSummary[] }) {
  const t = TIERS.find((x) => x.slug === tier)!;
  const shown = faces(brands);
  const more = brands.length - shown.length;
  return (
    <div data-tier={tier} className="flex gap-4 pb-10 lg:flex-col lg:gap-5 lg:pr-8 lg:pb-0">
      <span className="home-tj-node relative z-[1] grid size-14 shrink-0 place-items-center rounded-full border-2 border-ink bg-putih shadow-pop-sm lg:size-[120px] lg:shadow-pop">
        <span className="home-tj-ring" aria-hidden />
        <TierIcon tier={tier} size={40} className="lg:hidden" />
        <TierIcon tier={tier} size={96} className="hidden lg:block" />
      </span>
      <div className="min-w-0 pt-2 lg:pt-0">
        <span className="home-tj-stamp">
          <TierCop tier={tier} size="lg" />
        </span>
        <p className="mt-3 max-w-[32ch] text-body-sm text-ink-2">{TIER_COPY[tier].line}</p>
        <div data-reveal="" className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          <p className="flex items-baseline gap-1.5 text-ink">
            <Odometer value={brands.length} roll="reveal" className="text-[28px]" srText={`${brands.length} jenama`} />
            <span aria-hidden className="text-label text-ink-2">
              jenama
            </span>
          </p>
          {shown.length > 0 && (
            <span className="flex items-center" aria-hidden>
              {shown.map((b, i) => (
                <Monogram key={b.slug} slug={b.slug} name={b.name} category={b.category} size={36} className={i ? "-ml-2.5" : undefined} />
              ))}
              {more > 0 && (
                <span className="-ml-1.5 grid h-8 min-w-8 place-items-center rounded-full border-2 border-ink bg-putih px-1.5 font-num text-[13px] text-ink">
                  +{more}
                </span>
              )}
            </span>
          )}
        </div>
        <Link
          href={`/brands?tier=${tier}`}
          transitionTypes={["nav-forward"]}
          className="group mt-3 inline-flex min-h-11 items-center gap-1 text-label text-ink underline decoration-ink/30 decoration-2 underline-offset-4 hover:decoration-ink"
        >
          Tengok semua {t.name}
          <ArrowRight aria-hidden size={18} className="transition-transform duration-200 group-hover:translate-x-[3px]" />
        </Link>
      </div>
    </div>
  );
}

/**
 * "Dari Cili Padi ke Jenama Ikon" (DESIGN §8.1 #7, §7.5 #5): chili seed → sprouting leaf → crown.
 * A dashed connector draws with scroll; each station gets stamped (cop) as it switches on and its
 * kawaii icon plays its micro. Fully drawn without JS or under reduced motion.
 */
export function TierJourney({ brands }: { brands: BrandSummary[] }) {
  const steps = TIERS.map((t) => <Station key={t.slug} tier={t.slug} brands={brands.filter((b) => b.tier === t.slug)} />);
  return (
    <Band tone="senja" labelledBy="tier-journey-title" className="md:py-12">
      <SectionHeader id="tier-journey-title" title="Dari Cili Padi ke Jenama Ikon" sub="Setiap jenama besar pernah bermula kecil." />
      <ScrollStations
        label="Tiga saiz jenama"
        className="mt-8 lg:mt-10"
        steps={steps}
        itemAttrs={{ "data-tier-trigger": "" }}
        connectorClassName="left-[26px] top-[62px] -bottom-1.5 w-1 lg:left-[132px] lg:right-3 lg:top-[58px] lg:bottom-auto lg:h-1 lg:w-auto"
        fillClassName="bg-[repeating-linear-gradient(180deg,var(--color-ink)_0_8px,transparent_8px_14px)] lg:bg-[repeating-linear-gradient(90deg,var(--color-ink)_0_8px,transparent_8px_14px)]"
      />
    </Band>
  );
}
