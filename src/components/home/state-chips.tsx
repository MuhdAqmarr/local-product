import { Link } from "@/i18n/link";
import { MapPin, Megaphone } from "@/components/ui/lucide";
import { Chip } from "@/components/ui/chip";
import { SectionHeader } from "@/components/ui/section-header";
import type { BrandSummary } from "@/lib/catalog";
import { STATES } from "@/lib/taxonomy";
import { plural } from "@/i18n/format";
import { getDictionary } from "@/i18n/server";

/**
 * "Explore by state" / "Jelajah ikut negeri" (DESIGN §8.1 #9): all 16 states with their brand counts. Phones get a
 * two-row horizontal scroller; from `md` the chips wrap. Empty states are shown, muted, as an
 * invitation to suggest a brand from there.
 */
export async function StateChips({ brands }: { brands: BrandSummary[] }) {
  const t = (await getDictionary()).home.states;
  const counts = new Map<string, number>();
  for (const b of brands) if (b.state) counts.set(b.state, (counts.get(b.state) ?? 0) + 1);

  return (
    <section aria-labelledby="negeri-title" className="container-page [contain-intrinsic-size:auto_280px] [content-visibility:auto]">
      <SectionHeader id="negeri-title" title={t.title} sub={t.sub} />
      <div
        data-lenis-prevent-horizontal=""
        className="no-scrollbar edge-fade -mx-(--gutter) mt-5 overflow-x-auto px-(--gutter) py-2 [--fade:20px] md:mx-0 md:overflow-visible md:px-0 md:[mask-image:none] md:[-webkit-mask-image:none]"
      >
        <ul className="home-states" aria-label={t.listLabel}>
          {STATES.map((state) => {
            const n = counts.get(state) ?? 0;
            return (
              <li key={state}>
                {n > 0 ? (
                  <Chip href={`/brands?negeri=${encodeURIComponent(state)}`} prefetch={false} icon={<MapPin strokeWidth={2} />} count={n} transitionTypes={["nav-forward"]}>
                    {state}
                    <span className="sr-only">{plural(n, t.count)}</span>
                  </Chip>
                ) : (
                  <Link
                    href="/about#cadang"
                    className="group/chip relative inline-flex h-10 shrink-0 items-center gap-2 rounded-full border-[1.5px] border-dashed border-garis-kuat bg-santan pr-3.5 pl-2.5 text-label whitespace-nowrap text-ink-soft transition-colors duration-150 hover:bg-kapas before:absolute before:-inset-y-[2px] before:inset-x-0 before:content-['']"
                  >
                    <Megaphone aria-hidden size={18} strokeWidth={2} />
                    {state}
                    <span className="text-caption text-ink-soft">{t.empty}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
