import { ViewTransition } from "react";
import { BrandLink as IntentLink } from "@/components/brand/brand-link";
import { LayoutGrid } from "@/components/ui/lucide";
import { CategoryGlyph } from "@/components/product/category-glyph";
import { formatCount } from "@/lib/format";
import { CATEGORY_BY_SLUG } from "@/lib/taxonomy";
import type { CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface CategoryTileProps {
  /** A category, or "all" for the "Semua jenama" tile (→ /brands). */
  slug: CategorySlug | "all";
  /** Live promo count (`CategorySummary.promos`); the pill hides at 0. */
  promos?: number;
  /** "{n} jenama" under the label (desktop). For "all": the total brand count. */
  brands?: number;
  /** Compact (popover / sheet): 56 px squircle, no shelf contact shadow. */
  compact?: boolean;
  /** Morph the squircle into the category hero icon (`cat-ic-{slug}`). Only once per page. */
  morph?: boolean;
  /** Standing on a CategoryShelf plank: the label sits below the plank edge. */
  onShelf?: boolean;
  className?: string;
}

/**
 * Category tile (DESIGN §6.5): one link wrapping a `--cat-mid` squircle with an ink icon, a
 * Fredoka promo-count pill and the Malay label. Hops off the shelf on hover, squashes on press.
 */
export function CategoryTile({ slug, promos = 0, brands, compact, morph = true, onShelf, className }: CategoryTileProps) {
  const all = slug === "all";
  const cat = all ? null : CATEGORY_BY_SLUG[slug];
  const href = all ? "/brands" : `/categories/${slug}`;
  const label = all ? "Semua jenama" : cat!.nameMs;
  const box = compact ? "size-14" : "size-16 lg:size-20";

  const squircle = (
    <span
      className={cn(
        "cat-squircle",
        "relative grid place-items-center rounded-tile border-2 border-ink text-ink",
        all ? "bg-keladi-tint" : "bg-(--cat-mid)",
        box,
      )}
    >
      <span className={cn("cat-icon", "grid place-items-center")}>
        {all ? (
          <LayoutGrid aria-hidden="true" size={compact ? 24 : 28} strokeWidth={2.25} className="lg:size-[34px]" />
        ) : (
          <CategoryGlyph category={slug as CategorySlug} size={compact ? 24 : 28} className="lg:size-[34px]" />
        )}
      </span>
      {/* glossy highlight */}
      <span aria-hidden="true" className="absolute top-2 left-2.5 h-1.5 w-3 -rotate-30 rounded-full bg-white/60" />
    </span>
  );

  const srCount = [promos > 0 ? `${promos} promo` : null, brands != null ? `${brands} jenama` : null].filter(Boolean).join(", ");

  return (
    // Dense grid (QA F06): no viewport prefetch; IntentLink warms the route on hover / touch / focus.
    <IntentLink
      href={href}
      transitionTypes={["nav-forward"]}
      data-cat={all ? undefined : slug}
      className={cn("cat-tile", "group/tile relative flex flex-col items-center gap-2 text-center", className)}
    >
      <span className={cn("cat-lift", "relative z-[1] flex flex-col items-center")}>
        {morph && !all ? (
          <ViewTransition name={`cat-ic-${slug}`} share="morph" default="none">
            {squircle}
          </ViewTransition>
        ) : (
          squircle
        )}
        {promos > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-1.5 -right-2.5 z-[2] inline-grid h-5 min-w-5 place-items-center rounded-full border-[1.5px] border-ink bg-putih px-1.5 font-num text-[11px] leading-none text-ink"
          >
            {promos > 99 ? "99+" : promos}
          </span>
        )}
      </span>
      {!compact && (
        <span aria-hidden="true" className={cn("cat-contact", "z-[1] -mt-3 h-2 w-[70%] rounded-[50%] bg-[rgb(43_23_54/0.12)]")} />
      )}
      <span className={cn("flex flex-col items-center gap-0.5", onShelf && "mt-2")}>
        <span className="line-clamp-2 text-label-sm [overflow-wrap:anywhere] text-ink">{label}</span>
        {brands != null && (
          <span aria-hidden="true" className={cn("text-caption text-ink-soft", !compact && "hidden lg:block")}>
            {formatCount(brands)} jenama
          </span>
        )}
        {srCount && <span className="sr-only">, {srCount}</span>}
      </span>
    </IntentLink>
  );
}
