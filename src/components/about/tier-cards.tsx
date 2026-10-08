import type { CSSProperties } from "react";
import { TierIcon } from "@/components/art/tier-icon";
import { TIER_COPY, TierCop } from "@/components/brand/tier-cop";
import { Odometer } from "@/components/feedback/odometer";
import { Button } from "@/components/ui/button";
import { TIERS } from "@/lib/taxonomy";
import type { TierSlug } from "@/lib/types";

/** What each tier means, in Malay (from the tier descriptions in taxonomy.ts). */
const CRITERIA: Record<TierSlug, string> = {
  "cili-padi": "Pembuat kecil, indie dan home-grown yang pedas melawan saiz.",
  "naik-daun": "Jenama lokal moden yang tiba-tiba semua orang sebut.",
  ikon: "Nama-nama yang kita membesar dengannya, dan masih sayang.",
};

/** #tier (DESIGN §8.8 #3): three tier cards with cop-lg, the 72 px kawaii icon, criteria and the live count. */
export function TierCards({ counts }: { counts: Record<TierSlug, number> }) {
  return (
    <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
      {TIERS.map((t, i) => (
        <li key={t.slug} data-tier={t.slug} data-reveal="" style={{ "--i": i } as CSSProperties} className="min-w-0">
          <article data-tier-trigger="" className="flex h-full flex-col rounded-card-lg border-2 border-ink bg-putih p-5 shadow-pop">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <span className="grid size-24 shrink-0 place-items-center rounded-full border-2 border-ink bg-(--tier-tint)">
                <TierIcon tier={t.slug} size={72} />
              </span>
              <TierCop tier={t.slug} size="lg" explain={false} />
            </div>
            <p className="mt-4 text-lead text-ink">{TIER_COPY[t.slug].line}</p>
            <p className="mt-2 text-body-sm text-ink-soft">{CRITERIA[t.slug]}</p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
              <span className="flex items-baseline gap-1.5 text-label text-ink-2">
                <Odometer value={counts[t.slug]} roll="reveal" className="font-num text-[24px] text-ink" srText={`${counts[t.slug]} jenama`} />
                <span aria-hidden="true">jenama</span>
              </span>
              <Button href={`/brands?tier=${t.slug}`} variant="ghost" size="sm" trailing="arrow">
                Tengok semua
              </Button>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
