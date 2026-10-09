"use client";

import { startTransition, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronDown, RefreshCw } from "@/components/ui/lucide";
import { Button } from "@/components/ui/button";
import { decodeCards, type CardFeed } from "@/components/listing/feed-codec";
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

/** Fetches a prerendered JSON feed (`/api/feed/promos`, `/api/feed/new`) once, decodes the slim wire format and shares it. */
export function loadFeed(endpoint: string): Promise<ProductCardData[]> {
  let promise = feeds.get(endpoint);
  if (!promise) {
    promise = fetch(endpoint).then(async (res) => {
      if (!res.ok) throw new Error(`${endpoint} ${res.status}`);
      return decodeCards((await res.json()) as CardFeed);
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
  /** The last load failed: show the inline error, and the button becomes the retry. */
  error?: boolean;
  /**
   * Prefetch hook: called once when the button comes within ~1 screen (800 px), and only after
   * the user has scrolled, so nothing is fetched on page load. Skipped on Save-Data.
   */
  onNear?: () => void;
  className?: string;
}

function useNear(onNear: (() => void) | undefined) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!onNear || !el || typeof IntersectionObserver === "undefined") return;
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    let io: IntersectionObserver | null = null;
    const arm = () => {
      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io?.disconnect();
          onNear();
        },
        { rootMargin: "800px 0px" },
      );
      io.observe(el);
    };
    window.addEventListener("scroll", arm, { passive: true, once: true });
    return () => {
      window.removeEventListener("scroll", arm);
      io?.disconnect();
    };
  }, [onNear]);
  return ref;
}

/** "Muat lagi" (DESIGN §0.3 #19): 24 per chunk, no infinite scroll, footer stays reachable. */
export function LoadMore({ shown, total, onMore, pending, noun = "produk", error, onNear, className }: LoadMoreProps) {
  const ref = useNear(shown < total ? onNear : undefined);
  if (shown >= total) return null;
  const progress = Math.min(1, shown / Math.max(1, total));
  return (
    <div ref={ref} className={cn("flex flex-col items-center gap-3 pt-6", className)}>
      {/* No aria-live: the listing's result count already announces changes. */}
      <p className="text-caption text-ink-soft">
        Kau dah tengok <span className="font-num text-ink">{formatCount(shown)}</span> daripada{" "}
        <span className="font-num text-ink">{formatCount(total)}</span> {noun}
      </p>
      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-kapas" aria-hidden="true">
        <div
          className="h-full origin-left bg-kuih-lapis transition-transform duration-500 ease-out-soft"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      {error && (
        <p role="alert" className="text-caption font-semibold text-sambal-pekat">
          Alamak, tak jadi. Cuba lagi?
        </p>
      )}
      <Button
        variant="secondary"
        onClick={onMore}
        loading={pending}
        icon={pending ? undefined : error ? <RefreshCw aria-hidden size={18} /> : <ChevronDown aria-hidden size={20} />}
      >
        {error ? "Cuba lagi" : "Muat lagi"}
      </Button>
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
