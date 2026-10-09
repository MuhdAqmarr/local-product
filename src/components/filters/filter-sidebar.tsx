"use client";

import { useId } from "react";
import { RotateCcw } from "@/components/ui/lucide";
import { activeCount } from "@/components/listing/listing-model";
import { cn } from "@/lib/utils";
import {
  CategoryRows,
  DiscountPills,
  FilterSection,
  PriceRows,
  SortRows,
  TextFilter,
  TierRows,
  type ControlProps,
} from "./filter-controls";

export interface FilterSidebarProps extends ControlProps {
  onReset: () => void;
  /** Called on first pointer/focus inside (warms the full list). */
  onIntent?: () => void;
  className?: string;
}

/**
 * Desktop filter sidebar (DESIGN §6.6, ≥ 1024 px): 248 px, sticky under the header, scrolls on
 * its own (`data-lenis-prevent`). Changes apply instantly; counts are faceted (each group counts
 * as if its own selection were cleared). /new's Minggu ni / Bulan ni lives in the header band.
 */
export function FilterSidebar({ kind, value, facets, onChange, onReset, onIntent, className }: FilterSidebarProps) {
  const uid = useId();
  const n = activeCount(value);
  const sortChanged = kind === "promos" ? value.susun !== "diskaun" : value.susun !== "baru";
  const props = { kind, value, facets, onChange };

  return (
    <aside aria-label="Tapisan" className={cn("hidden self-start lg:sticky lg:top-[calc(var(--header-total)+16px)] lg:block", className)} onPointerDownCapture={onIntent} onFocusCapture={onIntent}>
      <div
        data-lenis-prevent=""
        className="no-scrollbar max-h-[calc(100dvh-var(--header-total)-32px)] overflow-y-auto overscroll-contain rounded-card-lg border-2 border-garis bg-putih p-4"
      >
        <div className="flex min-h-10 items-center justify-between gap-2">
          <h2 className="text-title-3 text-ink">Tapis</h2>
          {(n > 0 || sortChanged) && (
            <button type="button" onClick={onReset} className="-mr-2 inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 text-label-sm text-telang hover:bg-keladi-tint">
              <RotateCcw aria-hidden size={14} strokeWidth={2.5} />
              Reset semua
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-col gap-5">
          <TextFilter
            id={`${uid}-q`}
            value={value.q}
            onChange={(q) => onChange({ q }, { animate: false })}
            placeholder="Tapis nama…"
          />

          <FilterSection title="Susun">
            <SortRows {...props} name={`${uid}-susun`} />
          </FilterSection>

          {kind === "promos" && (
            <FilterSection title="Diskaun">
              <DiscountPills {...props} />
            </FilterSection>
          )}

          <FilterSection title="Kategori">
            <CategoryRows {...props} />
          </FilterSection>

          <FilterSection title="Saiz jenama">
            <TierRows {...props} />
          </FilterSection>

          <FilterSection title="Harga">
            <PriceRows {...props} name={`${uid}-harga`} />
          </FilterSection>
        </div>
      </div>
    </aside>
  );
}
