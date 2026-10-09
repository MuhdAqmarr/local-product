import { ViewTransition, type ReactNode } from "react";
import { CategoryGlyph } from "@/components/product/category-glyph";
import { Odometer } from "@/components/feedback/odometer";
import { fmt, pluralForm, type Plural } from "@/i18n/format";
import { getDictionary, getLocale } from "@/i18n/server";
import { categoryBlurb, categoryName } from "@/lib/taxonomy";
import type { CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface CategoryHeroProps {
  slug: CategorySlug;
  brands: number;
  promos: number;
  newLaunches: number;
  /** Extra row under the stats (e.g. the site LivePill). */
  children?: ReactNode;
  className?: string;
}

function Screw({ className }: { className: string }) {
  return (
    <span aria-hidden="true" className={cn("absolute grid size-2.5 place-items-center rounded-full border-[1.5px] border-ink bg-putih", className)}>
      <span className="h-[1.5px] w-1.5 rotate-45 rounded-full bg-ink" />
    </span>
  );
}

function Stat({ value, noun }: { value: number; noun: Plural }) {
  const label = pluralForm(value, noun);
  return (
    <li className="flex items-baseline gap-1.5">
      <Odometer value={value} className="font-num text-[22px] text-ink md:text-[26px]" srText={`${value} ${label}`} />
      <span aria-hidden="true" className="text-label text-ink-2">
        {label}
      </span>
    </li>
  );
}

/**
 * Category "papan tanda" hero (DESIGN §8.6): an enamel signboard in the category tint with batik
 * on the right half, a 2 px ink inner frame inset 8 px with four little screws, the 96 px
 * `--cat-mid` squircle (morph target `cat-ic-{slug}` from the category tiles), a "Category"
 * overline, H1 name, blurb and a live stat row, all in the page language. Async Server Component
 * (reads the locale itself); reads `data-cat` from itself.
 */
export async function CategoryHero({ slug, brands, promos, newLaunches, children, className }: CategoryHeroProps) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.categories.hero;
  const name = categoryName(slug, locale);
  return (
    <header
      data-cat={slug}
      className={cn(
        "relative isolate mx-3 overflow-hidden rounded-sheet border-2 border-ink bg-cover-cat shadow-pop-lg md:mx-6 md:rounded-panel",
        className,
      )}
    >
      {/* batik bunga on the right half, fading towards the copy */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-[62%] [mask-image:linear-gradient(90deg,transparent,#000_45%)] md:w-1/2"
      >
        <span className="batik" />
      </span>
      {/* enamel inner frame */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-[20px] border-2 border-ink/80 md:rounded-[24px]" />
      <Screw className="left-4 top-4" />
      <Screw className="right-4 top-4" />
      <Screw className="bottom-4 left-4" />
      <Screw className="bottom-4 right-4" />

      <div className="relative flex flex-col gap-5 px-6 pb-8 pt-9 sm:flex-row sm:items-center sm:gap-7 md:px-12 md:py-12">
        <ViewTransition name={`cat-ic-${slug}`} share="morph" default="none">
          <span className="relative grid size-20 shrink-0 place-items-center rounded-tile border-2 border-ink bg-(--cat-mid) text-ink shadow-pop sm:size-24">
            <CategoryGlyph category={slug} size={40} />
            <span aria-hidden="true" className="absolute left-3 top-2.5 h-2 w-4 -rotate-30 rounded-full bg-white/60" />
          </span>
        </ViewTransition>

        <div className="min-w-0">
          <p className="text-overline uppercase text-(--cat-ink)">{t.overline}</p>
          <h1 className="mt-1 text-title-1 text-ink [overflow-wrap:anywhere]">{name}</h1>
          <p className="mt-2 max-w-[48ch] text-body text-ink-2">{categoryBlurb(slug, locale)}</p>
          <ul className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2" aria-label={fmt(t.stats, { name })}>
            <Stat value={brands} noun={t.brands} />
            <Stat value={promos} noun={t.promos} />
            <Stat value={newLaunches} noun={t.new} />
          </ul>
          {children && <div className="mt-4 flex flex-wrap items-center gap-3">{children}</div>}
        </div>
      </div>
    </header>
  );
}
