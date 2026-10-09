"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { X } from "@/components/ui/lucide";
import { chipPresence } from "@/lib/motion";
import { CATEGORY_BY_SLUG, TIER_BY_SLUG } from "@/lib/taxonomy";
import { activeCount, discountLabel, priceLabel, type FilterState } from "@/components/listing/listing-model";
import { cn } from "@/lib/utils";

interface Pill {
  key: string;
  label: string;
  remove: Partial<FilterState> | ((f: FilterState) => Partial<FilterState>);
}

function pills(f: FilterState): Pill[] {
  const out: Pill[] = [];
  if (f.since) out.push({ key: "since", label: "Sejak lawatan lepas", remove: { since: null } });
  if (f.masa === "minggu") out.push({ key: "masa", label: "Minggu ni", remove: { masa: "bulan" } });
  if (f.q.trim()) out.push({ key: "q", label: `“${f.q.trim()}”`, remove: { q: "" } });
  if (f.diskaun > 0) out.push({ key: "diskaun", label: `Diskaun ${discountLabel(f.diskaun)}`, remove: { diskaun: 0 } });
  for (const k of f.kat) out.push({ key: `kat-${k}`, label: CATEGORY_BY_SLUG[k].nameMs, remove: (cur) => ({ kat: cur.kat.filter((x) => x !== k) }) });
  for (const t of f.tier) out.push({ key: `tier-${t}`, label: TIER_BY_SLUG[t].name, remove: (cur) => ({ tier: cur.tier.filter((x) => x !== t) }) });
  if (f.harga) out.push({ key: "harga", label: priceLabel(f.harga), remove: { harga: null } });
  return out;
}

export interface ActiveFiltersProps {
  value: FilterState;
  onChange: (update: Partial<FilterState> | ((f: FilterState) => Partial<FilterState>)) => void;
  onReset: () => void;
  className?: string;
}

/**
 * Active-filter pills above the results (DESIGN §6.6): kapas pill + 16 px X, then "Reset semua".
 * Pills pop in/out with `chipPresence` (AnimatePresence, initial={false}); siblings snap.
 */
export function ActiveFilters({ value, onChange, onReset, className }: ActiveFiltersProps) {
  const list = pills(value);
  const show = activeCount(value) > 0;
  return (
    <div className={cn(!show && "hidden", className)}>
      <ul role="list" aria-label="Tapisan aktif" className="flex flex-wrap items-center gap-2">
        <AnimatePresence initial={false}>
          {list.map((p) => (
            <m.li key={p.key} variants={chipPresence} initial="hidden" animate="show" exit="exit" className="list-none">
              <span className="inline-flex h-8 max-w-[70vw] items-center gap-0.5 rounded-full bg-kapas pl-3 pr-0.5 text-label-sm text-ink">
                <span className="truncate">{p.label}</span>
                <button
                  type="button"
                  aria-label={`Buang tapisan ${p.label}`}
                  onClick={() => onChange(p.remove)}
                  className="relative grid size-7 shrink-0 place-items-center rounded-full text-ink transition-colors before:absolute before:-inset-1.5 before:content-[''] hover:bg-garis"
                >
                  <X aria-hidden size={16} strokeWidth={2.5} />
                </button>
              </span>
            </m.li>
          ))}
          {list.length > 1 && (
            <m.li key="reset" variants={chipPresence} initial="hidden" animate="show" exit="exit" className="list-none">
              <button type="button" onClick={onReset} className="inline-flex h-8 items-center rounded-full px-2 text-label-sm text-telang underline-offset-4 hover:underline">
                Reset semua
              </button>
            </m.li>
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
}
