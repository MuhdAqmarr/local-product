import type { CSSProperties } from "react";
import type { Locale } from "@/i18n/config";
import type { ProductCardData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";
import { ProductRow } from "./product-row";

export const PAGE_SIZE = 24;

export interface ProductGridProps {
  products: ProductCardData[];
  /** Page language (passed to every card). */
  locale: Locale;
  syncedAt: string;
  /** Per-brand price check time (`feeds[brand].fetchedAt`), when the page has it. */
  checkedAt?: Record<string, string | undefined>;
  /** Index of `products[0]` in the whole list (appended "Muat lagi" chunks). Controls eager images + reveals. */
  startIndex?: number;
  /** With the 248 px desktop filter sidebar: caps at 4 columns. */
  sidebar?: boolean;
  /** "Senarai" list view. */
  view?: "grid" | "list";
  emphasis?: "promo" | "baru";
  /** Number of eager images at the top of the list (the first is also fetchpriority=high). */
  eagerCount?: number;
  /** Set false when the grid starts below the fold (no LCP image here). */
  priorityFirst?: boolean;
  className?: string;
}

/** Column classes (DESIGN §6.1): 2 (< 640) → 3 → 4 (≥ 1024) → 5 (≥ 1280, no sidebar). */
export function gridColumns(sidebar?: boolean) {
  return cn("grid grid-cols-2 gap-x-2.5 gap-y-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4", !sidebar && "xl:grid-cols-5");
}

const MIN_W0: CSSProperties = { minWidth: 0 };
const CHUNK_STYLE: CSSProperties = { contentVisibility: "auto", containIntrinsicSize: "auto 1400px" };

/**
 * Responsive product grid. Server-renderable, hook-free (also used by client "Muat lagi" chunks).
 * Splits into 24-card chunks; every chunk after the first gets `content-visibility: auto`.
 * Items 0–7 never animate; later items use the CSS RevealObserver (`data-reveal`, `--i`).
 */
export function ProductGrid({
  products,
  locale,
  syncedAt,
  checkedAt,
  startIndex = 0,
  sidebar,
  view = "grid",
  emphasis,
  eagerCount = 4,
  priorityFirst = true,
  className,
}: ProductGridProps) {
  const chunks: ProductCardData[][] = [];
  for (let i = 0; i < products.length; i += PAGE_SIZE) chunks.push(products.slice(i, i + PAGE_SIZE));

  return (
    <div className={cn("flex flex-col", view === "list" ? "gap-2.5" : "gap-3.5 sm:gap-4", className)}>
      {chunks.map((chunk, c) => {
        const chunkStart = startIndex + c * PAGE_SIZE;
        return (
          <ul
            key={chunkStart}
            role="list"
            className={view === "list" ? "grid grid-cols-1 gap-2.5 md:grid-cols-2" : gridColumns(sidebar)}
            style={chunkStart > 0 ? CHUNK_STYLE : undefined}
          >
            {chunk.map((p, k) => {
              const index = chunkStart + k;
              const reveal = index >= 8;
              return (
                // No className on the reveal target: RevealObserver adds `is-in` to `class` before late
                // segments hydrate, and React would report a className mismatch.
                <li key={p.id} data-reveal={reveal ? "" : undefined} style={reveal ? ({ "--i": index % 4, minWidth: 0 } as CSSProperties) : MIN_W0}>
                  {view === "list" ? (
                    <ProductRow product={p} locale={locale} syncedAt={syncedAt} checkedAt={checkedAt?.[p.brand]} eager={index < eagerCount} emphasis={emphasis} />
                  ) : (
                    <ProductCard
                      product={p}
                      locale={locale}
                      syncedAt={syncedAt}
                      checkedAt={checkedAt?.[p.brand]}
                      priority={priorityFirst && index === 0}
                      eager={index < eagerCount}
                      emphasis={emphasis}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        );
      })}
    </div>
  );
}
