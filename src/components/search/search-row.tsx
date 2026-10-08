import type { ReactNode } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { TierIcon } from "@/components/art/tier-icon";
import { Monogram } from "@/components/brand/monogram";
import { CategoryGlyph } from "@/components/product/category-glyph";
import { DealSticker } from "@/components/product/deal-sticker";
import { PlateImage } from "@/components/product/plate-image";
import { PLATE_SIZES } from "@/components/product/plate-sizes";
import { displayPrice } from "@/components/product/price-text";
import type { SearchItem } from "@/lib/catalog";
import { normalizeText } from "@/lib/search";
import { CATEGORY_BY_SLUG, TIER_BY_SLUG } from "@/lib/taxonomy";
import type { Category } from "@/lib/taxonomy";
import type { TierSlug } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Search items may carry tier/state once the index includes them; rows show them when present. */
export type SearchBrandExtras = { tier?: TierSlug; state?: string };

/** Query words for highlighting (same normalisation as the ranking). */
export function queryWords(query: string): string[] {
  return normalizeText(query).split(" ").filter(Boolean);
}

/**
 * Wraps every occurrence of the query words in <mark> (case-insensitive). Overlapping matches merge.
 * Matching runs on a lower-cased copy, so it lines up with the original text one char to one char.
 */
export function Highlight({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>;
  const lower = text.toLowerCase();
  const ranges: Array<[number, number]> = [];
  for (const w of words) {
    let from = 0;
    while (w && from < lower.length) {
      const at = lower.indexOf(w, from);
      if (at < 0) break;
      ranges.push([at, at + w.length]);
      from = at + w.length;
    }
  }
  if (!ranges.length) return <>{text}</>;
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([r[0], r[1]]);
  }
  const out: ReactNode[] = [];
  let pos = 0;
  merged.forEach(([s, e], i) => {
    if (s > pos) out.push(text.slice(pos, s));
    out.push(<mark key={i}>{text.slice(s, e)}</mark>);
    pos = e;
  });
  if (pos < text.length) out.push(text.slice(pos));
  return <>{out}</>;
}

interface OptionProps {
  id: string;
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
  className?: string;
  children: ReactNode;
}

/**
 * One `role="option"` row. Options hold no focusable children (focus stays in the combobox input);
 * activation is click / Enter. The active row gets a bandung-tint fill and a 3 px bandung bar.
 */
function Option({ id, active, onSelect, onHover, className, children }: OptionProps) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      data-active={active || undefined}
      onClick={onSelect}
      onPointerMove={onHover}
      className={cn(
        "group/opt relative flex cursor-pointer select-none items-center gap-3 rounded-thumb px-3 py-2 transition-colors duration-100",
        active ? "bg-bandung-tint" : "[@media(hover:hover)]:hover:bg-kapas",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-2 left-0 w-[3px] origin-center rounded-full bg-bandung transition-transform duration-[120ms] ease-out-soft",
          active ? "scale-y-100" : "scale-y-0",
        )}
      />
      {children}
    </div>
  );
}

type RowBase = Omit<OptionProps, "children" | "className"> & { words: string[] };

export function SearchBrandRow({ item, words, ...opt }: RowBase & { item: SearchItem & SearchBrandExtras }) {
  const cat = CATEGORY_BY_SLUG[item.category];
  const meta = [cat?.nameMs, item.state].filter(Boolean).join(" · ");
  return (
    <Option {...opt} className="min-h-14">
      <Monogram slug={item.brand} name={item.brandName} category={item.category} size={36} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-label text-ink">
            <Highlight text={item.title} words={words} />
          </span>
          {item.tier && (
            <>
              <TierIcon tier={item.tier} size={16} className="shrink-0" />
              <span className="sr-only">, {TIER_BY_SLUG[item.tier].name}</span>
            </>
          )}
        </span>
        <span className="truncate text-caption text-ink-soft">{meta ? `Jenama · ${meta}` : "Jenama"}</span>
      </span>
      <ChevronRight aria-hidden="true" size={18} className="shrink-0 text-ink-soft transition-transform duration-150 group-data-[active]/opt:translate-x-0.5 group-data-[active]/opt:text-ink" />
    </Option>
  );
}

export function SearchProductRow({ item, words, ...opt }: RowBase & { item: SearchItem }) {
  return (
    <Option {...opt} className="min-h-16">
      <span data-cat={item.category} className="plate size-12 shrink-0 rounded-thumb bg-(--cat-tint)">
        <PlateImage src={item.image} alt="" category={item.category} sizes={PLATE_SIZES.search} glyph={20} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-body-sm text-ink-2">
          <Highlight text={item.title} words={words} />
        </span>
        <span className="truncate text-caption text-ink-soft">
          <Highlight text={item.brandName} words={words} />
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {item.discount ? <DealSticker discount={item.discount} size="mini" className="hidden xs:inline-flex" /> : null}
        {item.price != null && (
          <span className={cn("font-num text-[15px] leading-none", item.discount ? "text-bandung-pekat" : "text-ink")}>
            {displayPrice(item.price, item.currency)}
          </span>
        )}
        {item.discount ? <span className="sr-only">, diskaun {item.discount}%</span> : null}
        <ArrowUpRight aria-hidden="true" size={16} className="text-ink-soft" />
        <span className="sr-only">, buka kedai rasmi {item.brandName} (tab baru)</span>
      </span>
    </Option>
  );
}

/** Category result: a chip-shaped option in the category tint. */
export function SearchCategoryChip({ category, words, ...opt }: RowBase & { category: Category }) {
  return (
    <div
      id={opt.id}
      role="option"
      aria-selected={opt.active}
      onClick={opt.onSelect}
      onPointerMove={opt.onHover}
      data-cat={category.slug}
      className={cn(
        "inline-flex h-10 cursor-pointer select-none items-center gap-2 rounded-full pl-2.5 pr-3.5 text-label text-ink transition-colors duration-100",
        opt.active ? "border-2 border-ink bg-(--cat-tint) shadow-pop-sm" : "border-[1.5px] border-garis-kuat bg-putih [@media(hover:hover)]:hover:bg-kapas",
      )}
    >
      <span aria-hidden="true" className="text-(--cat-ink)">
        <CategoryGlyph category={category.slug} size={18} />
      </span>
      <span>
        <Highlight text={category.nameMs} words={words} />
      </span>
      <span className="sr-only">, kategori</span>
    </div>
  );
}
