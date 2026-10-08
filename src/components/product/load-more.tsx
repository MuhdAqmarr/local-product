"use client";

import { startTransition, useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCount } from "@/lib/format";
import type { ProductCardData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { gridColumns, PAGE_SIZE, ProductGrid } from "./product-grid";

/* ------------------------------------------------------------------ */
/* ?page= (client-only: server pages never read searchParams)           */
/* ------------------------------------------------------------------ */

function readPage(): number {
  const raw = Number(new URLSearchParams(window.location.search).get("page"));
  return Number.isInteger(raw) && raw > 1 ? Math.min(raw, 200) : 1;
}

function writePage(page: number) {
  const url = new URL(window.location.href);
  if (page > 1) url.searchParams.set("page", String(page));
  else url.searchParams.delete("page");
  // Next.js integrates history.replaceState with useSearchParams; no server round trip.
  window.history.replaceState(window.history.state, "", url);
}

/** `[page, setPage]` synced with `?page=` after mount. Starts at 1 on the server and during hydration. */
export function usePageParam(): [number, (page: number) => void] {
  const [page, setPageState] = useState(1);
  useEffect(() => {
    const initial = readPage();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL is client-only state; read once after hydration
    if (initial !== 1) setPageState(initial);
  }, []);
  const setPage = useCallback((next: number) => {
    startTransition(() => {
      setPageState(next);
      writePage(next);
    });
  }, []);
  return [page, setPage];
}

/* ------------------------------------------------------------------ */
/* Feed cache: one request per endpoint per visit                       */
/* ------------------------------------------------------------------ */

const feeds = new Map<string, Promise<ProductCardData[]>>();

/** Fetches a prerendered JSON feed (`/api/feed/promos`, `/api/feed/new`) once and shares it. */
export function loadFeed(endpoint: string): Promise<ProductCardData[]> {
  let promise = feeds.get(endpoint);
  if (!promise) {
    promise = fetch(endpoint).then((res) => {
      if (!res.ok) throw new Error(`${endpoint} ${res.status}`);
      return res.json() as Promise<ProductCardData[]>;
    });
    promise.catch(() => feeds.delete(endpoint));
    feeds.set(endpoint, promise);
  }
  return promise;
}

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

export interface LoadMoreProps {
  shown: number;
  total: number;
  onMore: () => void;
  pending?: boolean;
  /** "promo", "produk", "jenama"… */
  noun?: string;
  error?: boolean;
  className?: string;
}

/** "Muat lagi" (DESIGN §0.3 #19): 24 per chunk, no infinite scroll, footer stays reachable. */
export function LoadMore({ shown, total, onMore, pending, noun = "produk", error, className }: LoadMoreProps) {
  if (shown >= total) return null;
  const progress = Math.min(1, shown / Math.max(1, total));
  return (
    <div className={cn("flex flex-col items-center gap-3 pt-6", className)}>
      <p className="text-caption text-ink-soft" aria-live="polite">
        Kau dah tengok <span className="font-num text-ink">{formatCount(shown)}</span> daripada{" "}
        <span className="font-num text-ink">{formatCount(total)}</span> {noun}
      </p>
      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-kapas" aria-hidden="true">
        <div
          className="h-full origin-left bg-kuih-lapis transition-transform duration-500 ease-out-soft"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      <Button variant="secondary" onClick={onMore} loading={pending} icon={pending ? undefined : <ChevronDown aria-hidden size={20} />}>
        Muat lagi
      </Button>
      {error && (
        <p role="alert" className="text-caption text-sambal-pekat">
          Alamak, tak jadi. Cuba lagi?
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pending chunk placeholder (shape-exact bones, no shadow)            */
/* ------------------------------------------------------------------ */

const SKELETON_TINTS = ["#FFE4F1", "#F3EFFF", "#FFF4C7"];

function PendingRow({ sidebar, count = 4 }: { sidebar?: boolean; count?: number }) {
  return (
    <div className={gridColumns(sidebar)} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col rounded-card border-2 border-garis bg-putih p-1.5 md:p-2">
          <div className="skeleton aspect-square rounded-plate" style={{ "--skel": SKELETON_TINTS[i % 3], "--i": i } as CSSProperties} />
          <div className="flex flex-col gap-2 px-1 pt-3 pb-2">
            <span className="bone h-2.5 w-2/5" />
            <span className="bone h-3 w-[90%]" />
            <span className="bone h-3 w-[70%]" />
            <span className="bone mt-1 h-4 w-[35%]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Append-after-server-grid                                             */
/* ------------------------------------------------------------------ */

export interface ProductFeedMoreProps {
  /** JSON feed whose order matches the server-rendered first chunk (same selector + options). */
  endpoint: string;
  /** How many items the server already rendered above this component. */
  initialCount?: number;
  /** Total items in the feed (from `getStats()`), so the button shows before the feed is fetched. */
  total: number;
  syncedAt: string;
  checkedAt?: Record<string, string | undefined>;
  sidebar?: boolean;
  view?: "grid" | "list";
  emphasis?: "promo" | "baru";
  noun?: string;
  /** Rendered once everything is shown ("Dah habis! …"). */
  end?: ReactNode;
  className?: string;
}

/**
 * Sits right under a server-rendered `<ProductGrid>` of the first `initialCount` items.
 * "Muat lagi" fetches the prerendered feed once, reveals the next 24 client-side and syncs `?page=`.
 * Opening a `?page=3` link restores 72 items after hydration (server HTML stays the default view).
 */
export function ProductFeedMore({
  endpoint,
  initialCount = PAGE_SIZE,
  total,
  syncedAt,
  checkedAt,
  sidebar,
  view,
  emphasis,
  noun = "produk",
  end,
  className,
}: ProductFeedMoreProps) {
  const [page, setPage] = usePageParam();
  const [items, setItems] = useState<ProductCardData[] | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [attempt, setAttempt] = useState(0);
  const want = Math.max(initialCount, page * PAGE_SIZE);
  const need = want > initialCount;

  useEffect(() => {
    if (!need || items) return;
    let alive = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reflects a network request started here
    setState("loading");
    loadFeed(endpoint)
      .then((list) => {
        if (!alive) return;
        setItems(list);
        setState("idle");
      })
      .catch(() => alive && setState("error"));
    return () => {
      alive = false;
    };
  }, [need, items, endpoint, attempt]);

  const known = items?.length ?? total;
  const extra = items ? items.slice(initialCount, want) : [];
  const shown = Math.min(known, initialCount + extra.length);

  return (
    <div className={className}>
      {extra.length > 0 && (
        <div className="mt-3.5 sm:mt-4">
          <ProductGrid
            products={extra}
            startIndex={initialCount}
            syncedAt={syncedAt}
            checkedAt={checkedAt}
            sidebar={sidebar}
            view={view}
            emphasis={emphasis}
            eagerCount={0}
            priorityFirst={false}
          />
        </div>
      )}
      {state === "loading" && view !== "list" && (
        <div className="mt-3.5 sm:mt-4" aria-busy="true">
          <span className="sr-only">Sedang dimuatkan…</span>
          <PendingRow sidebar={sidebar} />
        </div>
      )}
      {shown < known ? (
        <LoadMore
          shown={shown}
          total={known}
          noun={noun}
          pending={state === "loading"}
          error={state === "error"}
          onMore={() => {
            if (state === "error") {
              setAttempt((a) => a + 1);
              return;
            }
            setPage(Math.floor(shown / PAGE_SIZE) + 1);
          }}
        />
      ) : (
        end
      )}
    </div>
  );
}
