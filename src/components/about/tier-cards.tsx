import type { CSSProperties } from "react";
import { TierIcon } from "@/components/art/tier-icon";
import { TierCop } from "@/components/brand/tier-cop";
import { Odometer } from "@/components/feedback/odometer";
import { Button } from "@/components/ui/button";
import { tierCopy, TIERS } from "@/lib/taxonomy";
import type { TierSlug } from "@/lib/types";
import { getDictionary, getLocale } from "@/i18n/server";
import { plural, pluralForm } from "@/i18n/format";

/** #tier (DESIGN §8.8 #3): three tier cards with cop-lg, the 72 px kawaii icon, criteria and the live count. */
export async function TierCards({ counts }: { counts: Record<TierSlug, number> }) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.about.tiers;
  return (
    <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
      {TIERS.map((tier, i) => (
        <li key={tier.slug} data-tier={tier.slug} data-reveal="" style={{ "--i": i } as CSSProperties} className="min-w-0">
          <article data-tier-trigger="" className="flex h-full flex-col rounded-card-lg border-2 border-ink bg-putih p-5 shadow-pop">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <span className="grid size-24 shrink-0 place-items-center rounded-full border-2 border-ink bg-(--tier-tint)">
                <TierIcon tier={tier.slug} size={72} />
              </span>
              <TierCop locale={locale} tier={tier.slug} size="lg" explain={false} />
            </div>
            <p className="mt-4 text-lead text-ink">{tierCopy(tier.slug, locale).line}</p>
            <p className="mt-2 text-body-sm text-ink-soft">{tierCopy(tier.slug, locale).description}</p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
              <span className="flex items-baseline gap-1.5 text-label text-ink-2">
                <Odometer value={counts[tier.slug]} roll="reveal" className="font-num text-[24px] text-ink" srText={plural(counts[tier.slug], t.srCount)} />
                <span aria-hidden="true">{pluralForm(counts[tier.slug], t.count)}</span>
              </span>
              <Button href={`/brands?tier=${tier.slug}`} variant="ghost" size="sm" trailing="arrow">
                {t.seeAll}
              </Button>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
