"use client";

import { useId, useMemo, useState } from "react";
import { Odometer } from "@/components/feedback/odometer";
import { Button, Dots } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { applyFilters, computeFacets, defaultFilters, type FilterState, type ListingKind } from "@/components/listing/listing-model";
import type { ProductCardData } from "@/lib/types";
import {
  CategoryGrid,
  DiscountControl,
  FilterSection,
  MasaControl,
  NOUN,
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
  const noun = NOUN[kind];

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Tapis"
      description={kind === "promos" ? "Pilih apa yang kau nak usha." : "Cari launch yang kena dengan kau."}
      id={`${uid}-tapis`}
      footer={
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setDraft(defaultFilters(kind))}>
            Reset
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
            Tunjuk{" "}
            {count == null ? <Dots className="mx-1 inline-flex" /> : <Odometer value={count} className="font-num" />} {noun}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6 pt-1">
        <TextFilter
          id={`${uid}-q`}
          value={draft.q}
          onChange={(q) => setDraft((d) => ({ ...d, q }))}
          placeholder="Tapis produk, jenama…"
        />

        <FilterSection title="Susun">
          <SortControl {...props} />
        </FilterSection>

        {kind === "new" && (
          <FilterSection title="Bila launch">
            <MasaControl {...props} />
          </FilterSection>
        )}

        <FilterSection title="Kategori">
          <CategoryGrid {...props} />
        </FilterSection>

        <FilterSection title="Saiz jenama">
          <TierCards {...props} />
        </FilterSection>

        {kind === "promos" && (
          <FilterSection title="Diskaun">
            <DiscountControl {...props} />
          </FilterSection>
        )}

        <FilterSection title="Harga">
          <PriceChips {...props} />
        </FilterSection>
      </div>
    </Sheet>
  );
}
