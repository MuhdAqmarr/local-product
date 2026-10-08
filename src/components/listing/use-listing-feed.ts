"use client";

import { addTransitionType, startTransition, useCallback, useEffect, useRef, useState } from "react";
import { loadFeed } from "@/components/product/load-more";
import type { ProductCardData } from "@/lib/types";

export type FeedState = "idle" | "loading" | "ready" | "error";

/** Resolved feeds survive remounts (Activity, client navigation back) for this page life. */
const resolved = new Map<string, ProductCardData[]>();

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * The full prerendered feed for a listing (`/api/feed/promos`, `/api/feed/new`), fetched lazily:
 * on the first interaction (`load()`), when `eager` (URL filters, `?page=`), or once the browser
 * is idle a little after the page settles. Save-Data users only fetch on interaction. The swap
 * from the server's first 24 to the full list runs in a "filter" transition, so a filtered view
 * crossfades in.
 */
export function useListingFeed(endpoint: string, { eager }: { eager: boolean }) {
  const [items, setItems] = useState<ProductCardData[] | null>(() => resolved.get(endpoint) ?? null);
  const [state, setState] = useState<FeedState>(() => (resolved.has(endpoint) ? "ready" : "idle"));
  const alive = useRef(true);
  const inflight = useRef(false);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const load = useCallback(() => {
    if (inflight.current) return;
    const cached = resolved.get(endpoint);
    if (cached) {
      setItems((prev) => prev ?? cached);
      setState("ready");
      return;
    }
    inflight.current = true;
    setState("loading");
    loadFeed(endpoint)
      .then((list) => {
        resolved.set(endpoint, list);
        if (!alive.current) return;
        startTransition(() => {
          addTransitionType("filter");
          setItems(list);
          setState("ready");
        });
      })
      .catch(() => {
        if (alive.current) setState("error");
      })
      .finally(() => {
        inflight.current = false;
      });
  }, [endpoint]);

  // Needed right away (URL filters, ?page=): fetch now.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- starts a request whose status this hook reports
    if (eager && state === "idle") load();
  }, [eager, state, load]);

  // Otherwise warm it when the main thread is idle, a little after load (not on Save-Data).
  useEffect(() => {
    if (state !== "idle") return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const w = window as IdleWindow;
    let idle: number | undefined;
    const timer = window.setTimeout(() => {
      idle = w.requestIdleCallback ? w.requestIdleCallback(load, { timeout: 4000 }) : window.setTimeout(load, 200);
    }, 2500);
    return () => {
      window.clearTimeout(timer);
      if (idle != null) (w.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, [state, load]);

  return { items, state, load };
}
