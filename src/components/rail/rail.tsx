import { Children, type ReactNode } from "react";
import { Link } from "@/i18n/link";
import { ArrowRight } from "@/components/ui/lucide";
import { RailStagger } from "@/components/motion/rail-stagger";
import { fmt, pluralForm, type MaybePlural } from "@/i18n/format";
import { rich } from "@/i18n/rich";
import { getDictionary, getLocale } from "@/i18n/server";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";
import { RailControls } from "./rail-controls";
import { RailEndCard } from "./rail-end-card";

export interface RailProps {
  /** Unique on the page; used for the track id and heading id. */
  id: string;
  title: ReactNode;
  /** Plain-text title for the scroll region's accessible name (when `title` has markup). */
  titleText?: string;
  sub?: ReactNode;
  /** Small overline above the title ("THIS WEEK"). */
  eyebrow?: ReactNode;
  /** Decoration beside the title (e.g. a small wau). */
  art?: ReactNode;
  /** Live count in the header row ("38 promos"). */
  count?: number;
  /** Noun for the count and end card: `{ one: "promo", other: "promos" }` or one string (default: products). */
  noun?: MaybePlural;
  /** "See all →" target (language-neutral); also renders the end card. */
  href?: string;
  /** Once-per-session mobile swipe hint (first rail on Home only). */
  hint?: boolean;
  /** Heading level (default h2). */
  as?: "h2" | "h3";
  children: ReactNode;
  className?: string;
}

/**
 * Horizontal rail (DESIGN §6.11): header row (title, sub, live count, "Tengok semua", desktop
 * arrows), a snap track (`data-lenis-prevent-horizontal`, focusable region, SSR-visible cascade
 * of the first 6 cells), a CSS scroll-driven progress thumb and an end card.
 * Cells are `clamp(148px, 42vw, 188px)` on phones (≈ 2.3 visible) and 216 px on desktop.
 * Async (reads the page language): Server Components only.
 */
export async function Rail({ id, title, titleText, sub, eyebrow, art, count, noun, href, hint, as: H = "h2", children, className }: RailProps) {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  const r = t.common.rail;
  const nounForms = noun ?? r.nounProducts;
  const word = pluralForm(count ?? 2, nounForms);
  const trackId = `${id}-track`;
  const headingId = `${id}-title`;
  const label = fmt(r.region, { title: titleText ?? (typeof title === "string" ? title : word) });
  const cells = Children.toArray(children);

  return (
    <section aria-labelledby={headingId} className={cn("rail-section", "relative", className)}>
      <div className="container-page flex items-end justify-between gap-4">
        <div className="flex min-w-0 items-end gap-3">
          <div className="min-w-0">
            {eyebrow && <p className="mb-1 text-overline text-ink-2 uppercase">{eyebrow}</p>}
            <H id={headingId} className="text-title-2 text-ink">
              {title}
            </H>
            {sub && <p className="mt-1 max-w-[52ch] text-body-sm text-ink-2">{sub}</p>}
          </div>
          {art && <span className="hidden shrink-0 xs:block">{art}</span>}
        </div>
        <div className="flex shrink-0 items-center gap-3 pb-0.5">
          {count != null && (
            <span className="hidden text-caption text-ink-2 sm:inline">
              {rich("{count} {noun}", { count: <span className="font-num text-[15px] text-ink">{formatCount(count)}</span>, noun: word })}
            </span>
          )}
          {href && (
            <Link
              href={href}
              transitionTypes={["nav-forward"]}
              className="group inline-flex min-h-11 items-center gap-1 text-label whitespace-nowrap text-telang underline-offset-4 hover:underline"
            >
              {r.seeAll}
              <ArrowRight aria-hidden="true" size={18} strokeWidth={2.25} className="transition-transform duration-200 group-hover:translate-x-[3px]" />
            </Link>
          )}
          <RailControls trackId={trackId} />
        </div>
      </div>

      {/* Full-bleed track: the inset puts the first card on the heading's line (the container-page
          content edge) while scrolled cards run on to the band/section edge instead of being cut at
          an invisible 1240 px line. Padding % and scroll-padding % both resolve against the section
          width here, so the two values stay identical. */}
      <RailStagger
        id={trackId}
        label={label}
        hint={hint}
        className={cn(
          "rail-track",
          "no-scrollbar grid auto-cols-[var(--rail-col)] grid-flow-col gap-3 overflow-x-auto overscroll-x-contain pt-3 pb-5 snap-x snap-mandatory",
          "[--rail-inset:max(var(--gutter),calc((100%-var(--container))/2+var(--gutter)))] scroll-px-(--rail-inset) px-(--rail-inset)",
          "[--rail-col:clamp(148px,42vw,188px)] lg:[--rail-col:216px]",
          "focus-visible:outline-offset-[-3px]",
        )}
        itemClassName="snap-start min-w-0"
      >
        {cells}
        {href && <RailEndCard key="rail-end" href={href} count={count} noun={word} locale={locale} />}
      </RailStagger>

      <div className={cn("rail-progress", "mx-auto -mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-kapas")} aria-hidden="true">
        <div className={cn("rail-thumb", "h-full w-full bg-kuih-lapis")} />
      </div>
    </section>
  );
}
