/**
 * Pure listing logic for /promos and /new: filter, sort, group and facet counts.
 * Shared by the server pages (first 24 items, initial counts) and the client island, so the
 * server HTML and the client's first full render agree item for item. No hooks, no clock:
 * "this week" is measured from the catalog's syncedAt.
 */
import { myDayKey } from "@/components/product/kalendar-koyak";
import { dealLevel, type DealLevel } from "@/lib/deal";
import { CATEGORIES, TIERS } from "@/lib/taxonomy";
import type { CategorySlug, ProductCardData, TierSlug } from "@/lib/types";

export type ListingKind = "promos" | "new";
export type SortKey = "diskaun" | "murah" | "jimat" | "az" | "baru";
export type Masa = "minggu" | "bulan";

export interface PriceRange {
  min: number;
  /** Exclusive upper bound; null = no cap. */
  max: number | null;
}

export interface FilterState {
  kat: CategorySlug[];
  tier: TierSlug[];
  /** Minimum discount in percent; 0 = any (promos only). */
  diskaun: number;
  harga: PriceRange | null;
  q: string;
  susun: SortKey;
  /** /new only: launched within 7 days ("minggu") or the whole 30-day window ("bulan"). */
  masa: Masa;
  /** /new only: ISO time of the last visit (from the Home "Sejak lawatan lepas" chip). */
  since: string | null;
}

export const PAGE_SIZE = 24;
export const WEEK_DAYS = 7;

export const DEFAULT_SORT: Record<ListingKind, SortKey> = { promos: "diskaun", new: "baru" };

export function defaultFilters(kind: ListingKind): FilterState {
  return { kat: [], tier: [], diskaun: 0, harga: null, q: "", susun: DEFAULT_SORT[kind], masa: "bulan", since: null };
}

export const SORT_OPTIONS: Record<ListingKind, { value: SortKey; label: string }[]> = {
  promos: [
    { value: "diskaun", label: "Diskaun paling besar" },
    { value: "murah", label: "Harga paling murah" },
    { value: "jimat", label: "Jimat paling banyak" },
    { value: "az", label: "Jenama A–Z" },
  ],
  new: [
    { value: "baru", label: "Paling baru" },
    { value: "murah", label: "Harga paling murah" },
    { value: "az", label: "Jenama A–Z" },
  ],
};

export const DISCOUNT_STEPS = [0, 10, 20, 30, 40, 50] as const;

export const PRICE_PRESETS: { id: string; range: PriceRange }[] = [
  { id: "0-20", range: { min: 0, max: 20 } },
  { id: "20-50", range: { min: 20, max: 50 } },
  { id: "50-100", range: { min: 50, max: 100 } },
  { id: "100-", range: { min: 100, max: null } },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);
export const TIER_SLUGS = TIERS.map((t) => t.slug);

/* ------------------------------------------------------------------ */
/* Labels                                                              */
/* ------------------------------------------------------------------ */

export function priceId(r: PriceRange): string {
  return `${r.min}-${r.max ?? ""}`;
}

export function priceLabel(r: PriceRange): string {
  if (r.min <= 0 && r.max != null) return `Bawah RM${r.max}`;
  if (r.max == null) return `Atas RM${r.min}`;
  return `RM${r.min}–${r.max}`;
}

export function discountLabel(d: number): string {
  return d > 0 ? `${d}%+` : "Semua";
}

/* ------------------------------------------------------------------ */
/* Filtering                                                           */
/* ------------------------------------------------------------------ */

function fold(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function queryTokens(q: string): string[] {
  return fold(q).split(/\s+/).filter(Boolean);
}

const haystacks = new WeakMap<ProductCardData, string>();
function haystack(p: ProductCardData): string {
  let h = haystacks.get(p);
  if (h == null) {
    h = fold(`${p.title} ${p.brandName} ${p.type ?? ""}`);
    haystacks.set(p, h);
  }
  return h;
}

const DAY_MS = 86_400_000;

type Facet = "kat" | "tier" | "diskaun" | "harga" | "masa";

/** Builds a predicate for `f`, optionally ignoring one facet (for "what if" facet counts). */
function predicate(f: FilterState, syncedAt: string, skip?: Facet) {
  const kat = skip === "kat" || f.kat.length === 0 ? null : new Set(f.kat);
  const tier = skip === "tier" || f.tier.length === 0 ? null : new Set(f.tier);
  const minDiscount = skip === "diskaun" ? 0 : f.diskaun;
  const harga = skip === "harga" ? null : f.harga;
  const tokens = queryTokens(f.q);
  const ref = Date.parse(syncedAt);
  const weekFrom = skip === "masa" || f.masa !== "minggu" ? null : ref - WEEK_DAYS * DAY_MS;
  const since = f.since ? Date.parse(f.since) : NaN;

  return (p: ProductCardData) => {
    if (kat && !kat.has(p.brandCategory)) return false;
    if (tier && !tier.has(p.brandTier)) return false;
    if (minDiscount > 0 && (p.discount ?? 0) < minDiscount) return false;
    if (harga) {
      // Ranges are in ringgit: a USD price cannot honestly be "bawah RM50".
      if (p.currency !== "MYR") return false;
      if (p.price < harga.min) return false;
      if (harga.max != null && p.price >= harga.max) return false;
    }
    if (weekFrom != null) {
      const t = p.publishedAt ? Date.parse(p.publishedAt) : NaN;
      if (!(t >= weekFrom)) return false;
    }
    if (Number.isFinite(since)) {
      const t = p.publishedAt ? Date.parse(p.publishedAt) : NaN;
      if (!(t > since)) return false;
    }
    if (tokens.length) {
      const h = haystack(p);
      for (const t of tokens) if (!h.includes(t)) return false;
    }
    return true;
  };
}

export function applyFilters(items: ProductCardData[], f: FilterState, syncedAt: string): ProductCardData[] {
  const keep = predicate(f, syncedAt);
  return items.filter(keep);
}

/* ------------------------------------------------------------------ */
/* Sorting (total orders: same output for any input order)             */
/* ------------------------------------------------------------------ */

const byId = (a: ProductCardData, b: ProductCardData) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
const newest = (a: ProductCardData, b: ProductCardData) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") || byId(a, b);
const myrFirst = (a: ProductCardData, b: ProductCardData) => Number(a.currency !== "MYR") - Number(b.currency !== "MYR");
const saved = (p: ProductCardData) => (p.compareAt != null && p.compareAt > p.price ? p.compareAt - p.price : 0);
const collator = new Intl.Collator("ms", { sensitivity: "base" });

/**
 * Stable sort that also interleaves brands inside each run of equal `key`, so one store's
 * site-wide "50% off" does not fill a whole screen.
 */
function interleaveWithin(items: ProductCardData[], key: (p: ProductCardData) => string | number): ProductCardData[] {
  const out: ProductCardData[] = [];
  let i = 0;
  while (i < items.length) {
    let j = i + 1;
    const k = key(items[i]);
    while (j < items.length && key(items[j]) === k) j++;
    if (j - i > 2) {
      const ranks = new Map<string, number>();
      const run = items.slice(i, j).map((p, index) => {
        const r = ranks.get(p.brand) ?? 0;
        ranks.set(p.brand, r + 1);
        return { p, r, index };
      });
      run.sort((a, b) => a.r - b.r || a.index - b.index);
      for (const x of run) out.push(x.p);
    } else {
      for (let n = i; n < j; n++) out.push(items[n]);
    }
    i = j;
  }
  return out;
}

export function sortItems(items: ProductCardData[], susun: SortKey): ProductCardData[] {
  const list = [...items];
  switch (susun) {
    case "diskaun":
      list.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0) || newest(a, b));
      return interleaveWithin(list, (p) => p.discount ?? 0);
    case "murah":
      return list.sort((a, b) => myrFirst(a, b) || a.price - b.price || (b.discount ?? 0) - (a.discount ?? 0) || byId(a, b));
    case "jimat":
      return list.sort((a, b) => myrFirst(a, b) || saved(b) - saved(a) || (b.discount ?? 0) - (a.discount ?? 0) || byId(a, b));
    case "az":
      return list.sort((a, b) => collator.compare(a.brandName, b.brandName) || newest(a, b));
    case "baru":
    default:
      list.sort(newest);
      return interleaveWithin(list, (p) => (p.publishedAt ? myDayKey(p.publishedAt) : ""));
  }
}

/* ------------------------------------------------------------------ */
/* Grouping                                                            */
/* ------------------------------------------------------------------ */

export type Group =
  | { kind: "deal"; key: string; level: DealLevel; count: number; start: number; items: ProductCardData[] }
  | { kind: "day"; key: string; date: string; count: number; start: number; items: ProductCardData[] }
  | { kind: "flat"; key: string; count: number; start: number; items: ProductCardData[] };

export function isGrouped(kind: ListingKind, susun: SortKey): boolean {
  return (kind === "promos" && susun === "diskaun") || (kind === "new" && susun === "baru");
}

function groupKey(kind: ListingKind, p: ProductCardData): string {
  if (kind === "promos") return `L${dealLevel(p.discount) ?? 1}`;
  return p.publishedAt ? myDayKey(p.publishedAt) : "tiada";
}

/** Per-group totals over the whole sorted result (headers show the full count, not just what is loaded). */
export function groupTotals(kind: ListingKind, sorted: ProductCardData[], susun: SortKey): Record<string, number> {
  const totals: Record<string, number> = {};
  if (!isGrouped(kind, susun)) return totals;
  for (const p of sorted) {
    const k = groupKey(kind, p);
    totals[k] = (totals[k] ?? 0) + 1;
  }
  return totals;
}

/** Splits the visible slice into groups. `totals` comes from `groupTotals()` on the full result. */
export function groupVisible(kind: ListingKind, visible: ProductCardData[], susun: SortKey, totals: Record<string, number>): Group[] {
  if (!isGrouped(kind, susun)) return [{ kind: "flat", key: "all", count: visible.length, start: 0, items: visible }];
  const groups: Group[] = [];
  visible.forEach((p, index) => {
    const k = groupKey(kind, p);
    const last = groups[groups.length - 1];
    if (last && last.key === k) {
      last.items.push(p);
      return;
    }
    const count = totals[k] ?? 0;
    if (kind === "promos") groups.push({ kind: "deal", key: k, level: (dealLevel(p.discount) ?? 1) as DealLevel, count, start: index, items: [p] });
    else groups.push({ kind: "day", key: k, date: p.publishedAt ?? "", count, start: index, items: [p] });
  });
  return groups;
}

/* ------------------------------------------------------------------ */
/* Facet counts                                                        */
/* ------------------------------------------------------------------ */

export interface Facets {
  kat: Partial<Record<CategorySlug, number>>;
  tier: Partial<Record<TierSlug, number>>;
  /** Count at or above each DISCOUNT_STEPS value. */
  diskaun: Record<number, number>;
  /** By preset id, plus the active custom range. */
  harga: Record<string, number>;
  /** Items in scope (every filter except price) priced in a currency other than MYR; RM bands never match them. */
  nonMyr: number;
  masa: Record<Masa, number>;
}

export function computeFacets(items: ProductCardData[], f: FilterState, syncedAt: string): Facets {
  const out: Facets = { kat: {}, tier: {}, diskaun: {}, harga: {}, nonMyr: 0, masa: { minggu: 0, bulan: 0 } };

  const noKat = predicate(f, syncedAt, "kat");
  const noTier = predicate(f, syncedAt, "tier");
  const noDisc = predicate(f, syncedAt, "diskaun");
  const noPrice = predicate(f, syncedAt, "harga");
  const noMasa = predicate(f, syncedAt, "masa");
  const weekFrom = Date.parse(syncedAt) - WEEK_DAYS * DAY_MS;
  const ranges = [...PRICE_PRESETS.map((p) => p.range)];
  if (f.harga && !PRICE_PRESETS.some((p) => priceId(p.range) === priceId(f.harga!))) ranges.push(f.harga);

  for (const p of items) {
    if (noKat(p)) out.kat[p.brandCategory] = (out.kat[p.brandCategory] ?? 0) + 1;
    if (noTier(p)) out.tier[p.brandTier] = (out.tier[p.brandTier] ?? 0) + 1;
    if (noDisc(p)) {
      const d = p.discount ?? 0;
      for (const s of DISCOUNT_STEPS) if (d >= s) out.diskaun[s] = (out.diskaun[s] ?? 0) + 1;
    }
    if (noPrice(p) && p.currency !== "MYR") out.nonMyr++;
    else if (noPrice(p)) {
      for (const r of ranges) {
        if (p.price >= r.min && (r.max == null || p.price < r.max)) {
          const id = priceId(r);
          out.harga[id] = (out.harga[id] ?? 0) + 1;
        }
      }
    }
    if (noMasa(p)) {
      out.masa.bulan++;
      const t = p.publishedAt ? Date.parse(p.publishedAt) : NaN;
      if (t >= weekFrom) out.masa.minggu++;
    }
  }
  return out;
}

/** Number of active filters (sort excluded), for the Tapis count bubble. */
export function activeCount(f: FilterState): number {
  return f.kat.length + f.tier.length + (f.diskaun > 0 ? 1 : 0) + (f.harga ? 1 : 0) + (f.q.trim() ? 1 : 0) + (f.masa === "minggu" ? 1 : 0) + (f.since ? 1 : 0);
}

export function isDefaultFilters(f: FilterState, kind: ListingKind): boolean {
  return activeCount(f) === 0 && f.susun === DEFAULT_SORT[kind];
}

/** Stable key of everything that changes the result set (used for the results view transition). */
export function resultKey(f: FilterState): string {
  return [f.kat.join(","), f.tier.join(","), f.diskaun, f.harga ? priceId(f.harga) : "", f.q.trim().toLowerCase(), f.susun, f.masa, f.since ?? ""].join("|");
}
