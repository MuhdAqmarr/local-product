"use client";

import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, ViewTransition, type ReactNode } from "react";
import { useLenis } from "lenis/react";
import { LayoutGrid, Rows3, Sparkles, X } from "@/components/ui/lucide";
import { WauBulan } from "@/components/art/wau-bulan";
import { EmptyState } from "@/components/feedback/empty-state";
import { Odometer } from "@/components/feedback/odometer";
import { ActiveFilters } from "@/components/filters/active-filters";
import { FilterBar } from "@/components/filters/filter-bar";
import { MasaControl, NOUN } from "@/components/filters/filter-controls";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { FilterUrlWatch } from "@/components/filters/filter-url-watch";
import { useFilterUrl, type FilterUpdate } from "@/components/filters/use-filter-url";
import { DealGroupHeader } from "@/components/product/deal-group-header";
import { KalendarKoyak } from "@/components/product/kalendar-koyak";
import { LoadMore } from "@/components/product/load-more";
import { gridColumns, ProductGrid } from "@/components/product/product-grid";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";
import { ProductRowSkeleton } from "@/components/skeletons/product-row-skeleton";
import { Band, type BandTone } from "@/components/ui/band";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { formatCount } from "@/lib/format";
import type { ProductCardData } from "@/lib/types";
import {
  applyFilters,
  computeFacets,
  DEFAULT_SORT,
  groupTotals,
  groupVisible,
  isDefaultFilters,
  PAGE_SIZE,
  sortItems,
  type Facets,
  type FilterState,
  type ListingKind,
} from "./listing-model";
import { useListingFeed } from "./use-listing-feed";
import "./listing.css";

const importSheet = () => import("@/components/filters/filter-sheet");
const FilterSheet = dynamic(importSheet, { ssr: false });

const VIEW_KEY = "lokallah:view";
type View = "grid" | "list";

/** Grid/Senarai, remembered in localStorage (read after mount; the server renders the grid). */
function useViewPref(urlView: View | null): [View, (v: View) => void] {
  const [view, setView] = useState<View>("grid");
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(VIEW_KEY);
    } catch {
      /* storage blocked: stay on grid */
    }
    const next = urlView ?? (stored === "list" ? "list" : null);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- per-viewer preference, client-only
    if (next) setView(next);
  }, [urlView]);
  const set = useCallback((v: View) => {
    setView(v);
    try {
      window.localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* ignore */
    }
  }, []);
  return [view, set];
}

export interface ProductListingProps {
  kind: ListingKind;
  endpoint: "/api/feed/promos" | "/api/feed/new";
  /** First 24 items in the default sort (server-rendered for LCP). */
  initial: ProductCardData[];
  /** Size of the whole scope (unfiltered). */
  total: number;
  /** Group sizes for the default sort over the whole scope. */
  initialGroupTotals: Record<string, number>;
  /** Facet counts for the default (unfiltered) view. */
  initialFacets: Facets;
  syncedAt: string;
  /** Server-rendered header band content (overline, H1, live pill, sub, art). */
  head: ReactNode;
  tone: BandTone;
}

// Phones show icons only (the toolbar shares one row with the count); labels stay for screen readers.
const VIEW_OPTIONS = [
  { value: "grid" as const, label: <span className="max-sm:sr-only">Grid</span>, ariaLabel: "Grid", icon: <LayoutGrid aria-hidden strokeWidth={2.25} /> },
  { value: "list" as const, label: <span className="max-sm:sr-only">Senarai</span>, ariaLabel: "Senarai", icon: <Rows3 aria-hidden strokeWidth={2.25} /> },
];

/**
 * /promos and /new listing island (DESIGN §8.2, §8.3, §6.6). The server passes the first 24 items
 * of the default view; the full feed loads on the first interaction or when idle, then filtering,
 * sorting, grouping and "Muat lagi" are all client-side with the URL as the source of truth.
 */
export function ProductListing({ kind, endpoint, initial, total, initialGroupTotals, initialFacets, syncedAt, head, tone }: ProductListingProps) {
  const { filters, applied, page, ready, urlView, setFilters, setPage, reset, syncFromUrl } = useFilterUrl(kind);
  const needFull = ready && (!isDefaultFilters(filters, kind) || page > 1);
  const { items, state, load } = useListingFeed(endpoint, { eager: needFull });
  const [view, setView] = useViewPref(urlView);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMounted, setSheetMounted] = useState(false);
  const resultsTop = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const noun = NOUN[kind];

  /* ---------------- derived ---------------- */
  const sorted = useMemo(() => (items ? sortItems(applyFilters(items, applied, syncedAt), applied.susun) : null), [items, applied, syncedAt]);
  const appliedDefault = isDefaultFilters(applied, kind);
  const list = sorted ?? initial;
  const waiting = !sorted && !appliedDefault;
  const count = sorted ? sorted.length : total;
  const susun = sorted ? applied.susun : DEFAULT_SORT[kind];
  const totals = useMemo(() => (sorted ? groupTotals(kind, sorted, applied.susun) : initialGroupTotals), [sorted, kind, applied.susun, initialGroupTotals]);
  const want = page * PAGE_SIZE;
  const visible = useMemo(() => list.slice(0, want), [list, want]);
  const groups = useMemo(() => groupVisible(kind, visible, susun, totals), [kind, visible, susun, totals]);
  const facets = useMemo(
    () => (items ? computeFacets(items, filters, syncedAt) : isDefaultFilters(filters, kind) ? initialFacets : null),
    [items, filters, syncedAt, kind, initialFacets],
  );
  const sinceCount = useMemo(() => {
    if (!items || !filters.since) return null;
    const t = Date.parse(filters.since);
    return items.filter((p) => p.publishedAt && Date.parse(p.publishedAt) > t).length;
  }, [items, filters.since]);
  const moreLoading = !sorted && want > initial.length && initial.length < total && state !== "error";

  /* ---------------- actions ---------------- */
  const scrollToResults = useCallback(() => {
    const el = resultsTop.current;
    if (!el) return;
    const header = document.getElementById("site-header")?.getBoundingClientRect().bottom ?? 0;
    const bar = el.closest("[data-listing]")?.querySelector<HTMLElement>(".sticky-stack");
    const barBottom = bar && bar.offsetHeight > 0 ? bar.getBoundingClientRect().bottom : 0;
    const top = el.getBoundingClientRect().top;
    const stack = Math.max(header, barBottom);
    if (top >= stack) return;
    const y = Math.max(0, window.scrollY + top - stack - 8);
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo({ top: y });
  }, [lenis]);

  const change = useCallback(
    (update: FilterUpdate, options?: { animate?: boolean }) => {
      load();
      scrollToResults();
      setFilters(update, options);
    },
    [load, scrollToResults, setFilters],
  );

  const resetAll = useCallback(() => {
    scrollToResults();
    reset();
  }, [reset, scrollToResults]);

  const intent = useCallback(() => {
    load();
    void importSheet();
  }, [load]);

  const openSheet = () => {
    intent();
    setSheetMounted(true);
    setSheetOpen(true);
  };

  const applySheet = (next: FilterState) => {
    setFilters(next);
    // The dialog still holds the scroll lock this frame; scroll once it has closed.
    requestAnimationFrame(() => requestAnimationFrame(scrollToResults));
  };

  const more = () => {
    load();
    setPage(page + 1);
  };

  const controls = { kind, value: filters, facets, onChange: change };
  const emptyScope = total === 0;
  const emptyFiltered = !emptyScope && sorted != null && sorted.length === 0;

  return (
    <>
      <Suspense fallback={null}>
        <FilterUrlWatch onSearch={syncFromUrl} />
      </Suspense>
      <Band as="header" tone={tone} className="mt-3 md:mt-5">
        {head}
        {kind === "new" && (
          <div className="relative mt-5 flex max-w-[360px] flex-col gap-1.5" onPointerDownCapture={intent}>
            <MasaControl {...controls} className="bg-putih/70" />
            <p className="px-2 text-caption text-ink-2">
              {filters.masa === "minggu" ? "7 hari terakhir" : "30 hari terakhir"}
              {facets && (
                <>
                  {" · "}
                  <span className="font-num text-ink">{formatCount(facets.masa[filters.masa])}</span> produk
                </>
              )}
            </p>
          </div>
        )}
      </Band>

      <div data-listing={kind} className="mt-3 lg:mt-8 lg:[--filterbar-h:0px]">
        <FilterBar {...controls} onOpenSheet={openSheet} onIntent={intent} />

        <div className="container-page lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-8">
          <FilterSidebar {...controls} onReset={resetAll} onIntent={intent} />

          <section aria-label={kind === "promos" ? "Senarai promo" : "Senarai produk baru"} className="min-w-0">
            <div ref={resultsTop} className="flex items-center justify-between gap-3 pb-3 pt-3 lg:pt-0">
              <p className="text-body text-ink-2" aria-live="polite" aria-atomic="true">
                Jumpa <Odometer value={count} className="font-num text-title-3 text-ink" /> {noun}
              </p>
              <Segmented size="sm" label="Paparan" options={VIEW_OPTIONS} value={view} onChange={setView} className="w-[104px] shrink-0 sm:w-[216px]" />
            </div>

            <ActiveFilters value={filters} onChange={(u) => change(u)} onReset={resetAll} className="pb-3" />

            {kind === "new" && filters.since && (
              <div className="mb-4 flex items-center gap-3 rounded-card border-2 border-ink bg-keladi-tint py-2 pl-3.5 pr-1.5 shadow-pop-sm">
                <Sparkles aria-hidden size={20} className="shrink-0 text-telang" />
                <p className="min-w-0 flex-1 text-body-sm text-ink" role="status">
                  {sinceCount == null ? (
                    "Tengah kira produk baru sejak kau datang last…"
                  ) : (
                    <>
                      <span className="font-num text-[17px]">{formatCount(sinceCount)}</span> produk baru sejak kau datang last
                    </>
                  )}
                </p>
                <button
                  type="button"
                  aria-label="Tutup dan tunjuk semua"
                  onClick={() => change({ since: null })}
                  className="grid size-10 shrink-0 place-items-center rounded-full text-ink hover:bg-putih/70"
                >
                  <X aria-hidden size={18} strokeWidth={2.5} />
                </button>
              </div>
            )}

            <div className="listing-results relative" data-pending={waiting ? "" : undefined} aria-busy={waiting || moreLoading || undefined}>
              {waiting && state !== "error" && <div aria-hidden className="progress-indeterminate listing-progress" />}
              {state === "error" && (waiting || moreLoading || (want > initial.length && !sorted)) && (
                <div role="alert" className="mb-3 flex flex-wrap items-center gap-3 rounded-card border-2 border-garis bg-mangga-tint px-4 py-3 text-body-sm text-ink">
                  Alamak, senarai penuh tak dapat dimuat. Cuba lagi?
                  <Button size="sm" variant="secondary" onClick={load}>
                    Cuba lagi
                  </Button>
                </div>
              )}

              <ViewTransition name={`results-${kind}`} update={{ filter: "auto", default: "none" }} default="none">
                <div className="listing-body">
                  {emptyScope ? (
                    kind === "promos" ? (
                      <EmptyState
                        mood="tidur"
                        title="Takde promo buat masa ni."
                        body="Oyen tengah jaga. Bila harga turun, keluar sini dulu."
                        primary={{ label: "Tengok yang baru", href: "/new", trailing: "arrow" }}
                      />
                    ) : (
                      <EmptyState
                        mood="tidur"
                        title="Senyap je minggu ni."
                        body="Jenama tengah masak produk baru. Check balik esok!"
                        primary={{ label: "Tengok promo", href: "/promos", trailing: "arrow" }}
                      />
                    )
                  ) : emptyFiltered ? (
                    <EmptyState
                      mood="cari"
                      title="Takde yang padan semua tapisan ni."
                      body="Buang satu dua tapisan, confirm jumpa."
                      primary={{ label: "Reset tapisan", onClick: resetAll }}
                    />
                  ) : (
                    <div className="flex flex-col gap-2">
                      {groups.map((g, gi) => (
                        <div key={g.key} className="flex flex-col gap-2">
                          {g.kind === "deal" && <DealGroupHeader level={g.level} count={g.count} />}
                          {g.kind === "day" && g.date && <KalendarKoyak date={g.date} reference={syncedAt} count={g.count} />}
                          <ProductGrid
                            products={g.items}
                            startIndex={g.start}
                            syncedAt={syncedAt}
                            sidebar
                            view={view}
                            emphasis={kind === "promos" ? "promo" : "baru"}
                            priorityFirst={gi === 0}
                            eagerCount={4}
                            className={g.kind === "flat" ? undefined : "pb-4"}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ViewTransition>

              {moreLoading && (
                <div className="mt-3.5 sm:mt-4" aria-hidden>
                  {view === "list" ? (
                    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                      {[0, 1, 2, 3].map((i) => (
                        <ProductRowSkeleton key={i} i={i} />
                      ))}
                    </div>
                  ) : (
                    <div className={gridColumns(true)}>
                      {[0, 1, 2, 3].map((i) => (
                        <ProductCardSkeleton key={i} i={i} className={i >= 2 ? "hidden sm:flex" : undefined} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!emptyScope && !emptyFiltered && (
                <>
                  {visible.length < count ? (
                    <LoadMore
                      shown={visible.length}
                      total={count}
                      noun={noun}
                      pending={state === "loading" && (moreLoading || waiting)}
                      error={false}
                      onMore={more}
                      className="pt-8"
                    />
                  ) : (
                    <ListEnd kind={kind} count={count} filtered={!appliedDefault} />
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </div>

      {sheetMounted && (
        <FilterSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          kind={kind}
          filters={filters}
          items={items}
          syncedAt={syncedAt}
          onApply={applySheet}
        />
      )}
    </>
  );
}

function ListEnd({ kind, count, filtered }: { kind: ListingKind; count: number; filtered: boolean }) {
  const noun = NOUN[kind];
  const text = filtered
    ? `Dah habis! Kau dah tengok semua ${formatCount(count)} ${noun} yang padan.`
    : kind === "promos"
      ? "Dah habis! Kau dah tengok semua promo hari ni."
      : `Dah habis! Kau dah tengok semua ${formatCount(count)} produk baru.`;
  return (
    <div data-reveal="" className="listing-end flex flex-col items-center gap-2 pb-2 pt-10 text-center">
      <WauBulan size={44} className="listing-wau" />
      <p className="max-w-[34ch] text-body text-ink-2">{text}</p>
      {kind === "promos" ? (
        <Button variant="ghost" href="/new" trailing="arrow" transitionTypes={["nav-tab"]}>
          Tengok yang baru sampai
        </Button>
      ) : (
        <Button variant="ghost" href="/promos" trailing="arrow" transitionTypes={["nav-tab"]}>
          Tengok promo panas
        </Button>
      )}
    </div>
  );
}
