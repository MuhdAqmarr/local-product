"use client";

import { useId, useMemo, useState } from "react";
import { Odometer } from "@/components/feedback/odometer";
import { Button, Dots } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { applyFilters, computeFacets, defaultFilters, type FilterState, type ListingKind } from "@/components/listing/listing-model";
import { useI18n } from "@/i18n/client";
import { pluralForm } from "@/i18n/format";
import { rich } from "@/i18n/rich";
import type { ProductCardData } from "@/lib/types";
import {
  CategoryGrid,
  DiscountControl,
  FilterSection,
  MasaControl,
  PriceChips,
  SortControl,
  TextFilter,
  TierCards,
} from "./filter-controls";

export interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  kind: ListingKind;
  /** The applied filters; the sheet edits a draft copy and applies it with "Tunjuk {n}". */
  filters: FilterState;
  /** Full unfiltered list for this page (null while it loads: the count shows dots). */
  items: ProductCardData[] | null;
  syncedAt: string;
  onApply: (next: FilterState) => void;
}

/**
 * Tapis sheet (DESIGN §6.6): native `<dialog class="sheet">`, sections Cari · Susun · (Bila launch)
 * · Kategori · Saiz jenama · Diskaun · Harga, and a sticky footer whose "Tunjuk {n} promo" count is
 * computed client-side from the draft. Lazy-loaded on intent.
 */
export default function FilterSheet({ open, onClose, kind, filters, items, syncedAt, onApply }: FilterSheetProps) {
  const { m } = useI18n();
  const t = m.listings.filters;
  const uid = useId();
  const [draft, setDraft] = useState(filters);
  const [wasOpen, setWasOpen] = useState(open);
  // Each time the sheet opens it starts from what the page currently shows.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDraft(filters);
  }

  const facets = useMemo(() => (items ? computeFacets(items, draft, syncedAt) : null), [items, draft, syncedAt]);
  const count = useMemo(() => (items ? applyFilters(items, draft, syncedAt).length : null), [items, draft, syncedAt]);
  const props = { kind, value: draft, facets, onChange: (patch: Partial<FilterState>) => setDraft((d) => ({ ...d, ...patch })) };
  const noun = pluralForm(count ?? 2, m.listings.noun[kind]);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={t.filter}
      description={kind === "promos" ? t.sheetPromos : t.sheetNew}
      id={`${uid}-tapis`}
      footer={
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setDraft(defaultFilters(kind))}>
            {t.reset}
          </Button>
          <Button
            className="flex-1"
            fullWidth
            disabled={count === 0}
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            {rich(t.show, {
              count: count == null ? <Dots className="mx-1 inline-flex" /> : <Odometer value={count} className="font-num" />,
              noun,
            })}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6 pt-1">
        <TextFilter
          id={`${uid}-q`}
          value={draft.q}
          onChange={(q) => setDraft((d) => ({ ...d, q }))}
          placeholder={t.searchSheet}
        />

        <FilterSection title={t.sort}>
          <SortControl {...props} />
        </FilterSection>

        {kind === "new" && (
          <FilterSection title={t.whenLaunched}>
            <MasaControl {...props} />
          </FilterSection>
        )}

        <FilterSection title={t.categories}>
          <CategoryGrid {...props} />
        </FilterSection>

        <FilterSection title={t.brandSize}>
          <TierCards {...props} />
        </FilterSection>

        {kind === "promos" && (
          <FilterSection title={t.discount}>
            <DiscountControl {...props} />
          </FilterSection>
        )}

        <FilterSection title={t.price}>
          <PriceChips {...props} />
        </FilterSection>
      </div>
    </Sheet>
  );
}
