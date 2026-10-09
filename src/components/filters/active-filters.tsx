"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { X } from "@/components/ui/lucide";
import { chipPresence } from "@/lib/motion";
import { categoryLabel, TIER_BY_SLUG } from "@/lib/taxonomy";
import { activeCount, discountLabel, priceLabel, type FilterLabels, type FilterState } from "@/components/listing/listing-model";
import { useI18n } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { cn } from "@/lib/utils";

interface Pill {
  key: string;
  label: string;
  remove: Partial<FilterState> | ((f: FilterState) => Partial<FilterState>);
}

function pills(f: FilterState, t: FilterLabels, locale: Locale): Pill[] {
  const out: Pill[] = [];
  if (f.since) out.push({ key: "since", label: t.since, remove: { since: null } });
  if (f.masa === "minggu") out.push({ key: "masa", label: t.masa.minggu, remove: { masa: "bulan" } });
  if (f.q.trim()) out.push({ key: "q", label: `“${f.q.trim()}”`, remove: { q: "" } });
  if (f.diskaun > 0) out.push({ key: "diskaun", label: fmt(t.discountPill, { value: discountLabel(f.diskaun, t) }), remove: { diskaun: 0 } });
  for (const k of f.kat) out.push({ key: `kat-${k}`, label: categoryLabel(k, locale), remove: (cur) => ({ kat: cur.kat.filter((x) => x !== k) }) });
  for (const t of f.tier) out.push({ key: `tier-${t}`, label: TIER_BY_SLUG[t].name, remove: (cur) => ({ tier: cur.tier.filter((x) => x !== t) }) });
  if (f.harga) out.push({ key: "harga", label: priceLabel(f.harga, t), remove: { harga: null } });
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
  // `m` is the motion namespace in this file: read messages without destructuring.
  const i18n = useI18n();
  const t = i18n.m.listings.filters;
  const list = pills(value, t, i18n.locale);
  const show = activeCount(value) > 0;
  return (
    <div className={cn(!show && "hidden", className)}>
      <ul role="list" aria-label={t.active} className="flex flex-wrap items-center gap-2">
        <AnimatePresence initial={false}>
          {list.map((p) => (
            <m.li key={p.key} variants={chipPresence} initial="hidden" animate="show" exit="exit" className="list-none">
              <span className="inline-flex h-8 max-w-[70vw] items-center gap-0.5 rounded-full bg-kapas pl-3 pr-0.5 text-label-sm text-ink">
                <span className="truncate">{p.label}</span>
                <button
                  type="button"
                  aria-label={fmt(t.remove, { label: p.label })}
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
                {t.resetAll}
              </button>
            </m.li>
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
}
