"use client";

import { addTransitionType, startTransition, useCallback, useRef, useState } from "react";
import {
  CATEGORY_SLUGS,
  DEFAULT_SORT,
  defaultFilters,
  DISCOUNT_STEPS,
  SORT_OPTIONS,
  TIER_SLUGS,
  type FilterState,
  type ListingKind,
  type PriceRange,
  type SortKey,
} from "@/components/listing/listing-model";
import type { CategorySlug, TierSlug } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Parse / serialise (client only: server pages never read searchParams) */
/* ------------------------------------------------------------------ */

const MAX_PAGE = 200;

function parsePrice(raw: string | null): PriceRange | null {
  if (!raw) return null;
  const m = /^(\d{1,6})?-(\d{1,6})?$/.exec(raw.trim());
  if (!m || (m[1] == null && m[2] == null)) return null;
  const min = m[1] != null ? Number(m[1]) : 0;
  const max = m[2] != null ? Number(m[2]) : null;
  if (max != null && max <= min) return null;
  return { min, max };
}

function parseSince(raw: string | null): string | null {
  if (!raw) return null;
  const n = /^\d{10,13}$/.test(raw) ? Number(raw.length === 10 ? Number(raw) * 1000 : raw) : Date.parse(raw);
  return Number.isFinite(n) ? new Date(n).toISOString() : null;
}

export function parseFilters(search: string, kind: ListingKind): { filters: FilterState; page: number; view: "grid" | "list" | null } {
  const sp = new URLSearchParams(search);
  const f = defaultFilters(kind);

  const kat = (sp.get("kat") ?? "").split(",").filter((s): s is CategorySlug => (CATEGORY_SLUGS as string[]).includes(s));
  f.kat = [...new Set(kat)];
  const tier = (sp.get("tier") ?? "").split(",").filter((s): s is TierSlug => (TIER_SLUGS as string[]).includes(s));
  f.tier = [...new Set(tier)];

  if (kind === "promos") {
    const d = Number(sp.get("diskaun"));
    // Snap any number to the closest step at or below it ("?diskaun=45" → 40%+).
    if (Number.isFinite(d) && d > 0) f.diskaun = [...DISCOUNT_STEPS].reverse().find((s) => s <= Math.min(d, 90)) ?? 0;
  }
  f.harga = parsePrice(sp.get("harga"));
  f.q = (sp.get("q") ?? "").slice(0, 60);

  const susun = sp.get("susun") as SortKey | null;
  if (susun && SORT_OPTIONS[kind].includes(susun)) f.susun = susun;

  if (kind === "new") {
    if (sp.get("masa") === "minggu") f.masa = "minggu";
    f.since = parseSince(sp.get("since"));
  }

  const p = Number(sp.get("page"));
  const page = Number.isInteger(p) && p > 1 ? Math.min(p, MAX_PAGE) : 1;
  const v = sp.get("view");
  const view = v === "senarai" ? "list" : v === "grid" ? "grid" : null;
  return { filters: f, page, view };
}

const OWN_KEYS = ["kat", "tier", "diskaun", "harga", "q", "susun", "masa", "since", "page"];

/** Writes the filter state into `url` (other params such as utm_* are kept). */
export function writeFilters(url: URL, f: FilterState, page: number, kind: ListingKind) {
  const sp = url.searchParams;
  for (const k of OWN_KEYS) sp.delete(k);
  if (f.kat.length) sp.set("kat", f.kat.join(","));
  if (f.tier.length) sp.set("tier", f.tier.join(","));
  if (kind === "promos" && f.diskaun > 0) sp.set("diskaun", String(f.diskaun));
  if (f.harga) sp.set("harga", `${f.harga.min}-${f.harga.max ?? ""}`);
  if (f.q.trim()) sp.set("q", f.q.trim());
  if (f.susun !== DEFAULT_SORT[kind]) sp.set("susun", f.susun);
  if (kind === "new" && f.masa === "minggu") sp.set("masa", "minggu");
  if (kind === "new" && f.since) sp.set("since", f.since);
  if (page > 1) sp.set("page", String(page));
}

/** Canonical query string for a state (used to compare URL vs state). */
function queryOf(f: FilterState, page: number, kind: ListingKind): string {
  const url = new URL("http://x/");
  writeFilters(url, f, page, kind);
  url.searchParams.sort();
  return url.search;
}

function replaceUrl(f: FilterState, page: number, kind: ListingKind) {
  const url = new URL(window.location.href);
  writeFilters(url, f, page, kind);
  if (url.href === window.location.href) return;
  // Next.js integrates history.replaceState with its router state: no server round trip.
  window.history.replaceState(window.history.state, "", url);
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export type FilterUpdate = Partial<FilterState> | ((prev: FilterState) => Partial<FilterState>);

export interface FilterUrlApi {
  /** What the controls show (updates urgently on every tap). */
  filters: FilterState;
  /** What the results show (updated inside a transition tagged "filter": the results crossfade). */
  applied: FilterState;
  /** Visible chunks of 24. */
  page: number;
  /** URL params read after mount (false during SSR and hydration). */
  ready: boolean;
  /** View from `?view=` when the link carried one. */
  urlView: "grid" | "list" | null;
  setFilters: (update: FilterUpdate, options?: { animate?: boolean }) => void;
  setPage: (page: number) => void;
  reset: () => void;
  /** Feed the current `location.search` in (see `FilterUrlWatch`). */
  syncFromUrl: (search: string) => void;
}

/**
 * Filters ↔ URL (DESIGN §6.6). Server HTML is always the default view; after mount the URL is
 * read (via `<FilterUrlWatch>`) and applied, and again whenever it changes from outside. Writes go through `history.replaceState` (Back still leaves the page),
 * and the result update runs in `startTransition` with the "filter" transition type so the
 * results `<ViewTransition>` crossfades. Text typing passes `animate: false`.
 */
export function useFilterUrl(kind: ListingKind): FilterUrlApi {
  const [filters, setFiltersState] = useState<FilterState>(() => defaultFilters(kind));
  const [applied, setApplied] = useState<FilterState>(filters);
  const [page, setPageState] = useState(1);
  const [ready, setReady] = useState(false);
  const [urlView, setUrlView] = useState<"grid" | "list" | null>(null);
  const current = useRef({ filters, page });

  /**
   * Apply the URL to state. Called by `<FilterUrlWatch>` after mount and whenever the URL changes
   * from outside (a Link to the same page with other params, Back/Forward, Activity re-show).
   * Our own replaceState writes come back here too and are ignored because nothing changed.
   */
  const syncFromUrl = useCallback(
    (search: string) => {
      const parsed = parseFilters(search, kind);
      setUrlView(parsed.view);
      setReady(true);
      if (queryOf(parsed.filters, parsed.page, kind) === queryOf(current.current.filters, current.current.page, kind)) return;
      current.current = { filters: parsed.filters, page: parsed.page };
      setFiltersState(parsed.filters);
      startTransition(() => {
        addTransitionType("filter");
        setApplied(parsed.filters);
        setPageState(parsed.page);
      });
    },
    [kind],
  );

  const commit = useCallback(
    (next: FilterState, nextPage: number, animate: boolean) => {
      current.current = { filters: next, page: nextPage };
      setFiltersState(next);
      replaceUrl(next, nextPage, kind);
      startTransition(() => {
        if (animate) addTransitionType("filter");
        setApplied(next);
        setPageState(nextPage);
      });
    },
    [kind],
  );

  const setFilters = useCallback(
    (update: FilterUpdate, options?: { animate?: boolean }) => {
      const prev = current.current.filters;
      const patch = typeof update === "function" ? update(prev) : update;
      commit({ ...prev, ...patch }, 1, options?.animate ?? true);
    },
    [commit],
  );

  const setPage = useCallback(
    (next: number) => {
      current.current = { ...current.current, page: next };
      replaceUrl(current.current.filters, next, kind);
      startTransition(() => setPageState(next));
    },
    [kind],
  );

  const reset = useCallback(() => commit(defaultFilters(kind), 1, true), [commit, kind]);

  return { filters, applied, page, ready, urlView, setFilters, setPage, reset, syncFromUrl };
}
