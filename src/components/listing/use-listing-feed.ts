"use client";

import { addTransitionType, startTransition, useCallback, useEffect, useRef, useState } from "react";
import { loadFeed } from "@/components/product/load-more";
import type { ProductCardData } from "@/lib/types";

export type FeedState = "idle" | "loading" | "ready" | "error";

/** Resolved feeds survive remounts (Activity, client navigation back) for this page life. */
const resolved = new Map<string, ProductCardData[]>();

/**
 * The full prerendered feed for a listing (`/api/feed/promos`, `/api/feed/new`), fetched only
 * when needed: on an interaction (`load()` from a filter, the sheet, "Muat lagi", or "Muat lagi"
 * scrolling near after the user has scrolled) or when `eager` (URL filters, `?page=`). Never on
 * page load or idle: it would compete with the first images on phones. The swap from the
 * server's first 24 to the full list runs in a "filter" transition, so a filtered view crossfades in.
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

  return { items, state, load };
}
