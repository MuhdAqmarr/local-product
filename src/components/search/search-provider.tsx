"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { decodeSearch, type SearchFeed } from "@/components/listing/feed-codec";
import type { SearchItem } from "@/lib/catalog";

/**
 * Props of the default export of `./search-dialog` (the real dialog replaces the stub with the
 * same contract):
 * - `open`: controlled; call `dialog.showModal()` when it becomes true, `dialog.close()` when false.
 * - `onClose`: call from the dialog's native "close" event (Esc, Batal, backdrop, result chosen).
 * - `initialQuery`: optional prefill (e.g. from the hero pill).
 * Load the index with `loadSearchIndex()` (shared, cached promise; warmed on trigger intent).
 */
export interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const importDialog = () => import("./search-dialog");
const SearchDialog = dynamic(importDialog, { ssr: false });

let indexPromise: Promise<SearchItem[]> | null = null;

/** Fetch `/api/feed/search` once per page life (prerendered + cached JSON, slim wire format decoded here). Retries after a failure. */
export function loadSearchIndex(): Promise<SearchItem[]> {
  indexPromise ??= fetch("/api/feed/search")
    .then(async (res) => {
      if (!res.ok) throw new Error(`search index ${res.status}`);
      return decodeSearch((await res.json()) as SearchFeed);
    })
    .catch((error: unknown) => {
      indexPromise = null;
      throw error;
    });
  return indexPromise;
}

/** Warm the dialog chunk (and optionally the index) on intent: pointerenter, focus, touchstart. */
export function preloadSearch(withIndex = true) {
  void importDialog();
  if (withIndex) loadSearchIndex().catch(() => {});
}

interface SearchContextValue {
  /** Open the search dialog (from a trigger, the hero pill or a hotkey). */
  open: (options?: { query?: string }) => void;
  close: () => void;
  isOpen: boolean;
}

const SearchContext = createContext<SearchContextValue | null>(null);

/** `const { open } = useSearch()` from any client component under the root layout. */
export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used inside <SearchProvider>");
  return ctx;
}

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
}

/** Owns the (code-split) search dialog and the global hotkeys: ⌘K, Ctrl+K and "/". */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState<string | undefined>();
  const keyedOnce = useRef(false);

  const open = useCallback((options?: { query?: string }) => {
    setQuery(options?.query);
    setMounted(true);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!keyedOnce.current) {
        keyedOnce.current = true;
        preloadSearch(false);
      }
      const k = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && k === "k") {
        // Another dialog (Tapis sheet, modal) owns focus and the scroll lock: don't open search behind it.
        if (document.querySelector("dialog[open]:not([data-search-dialog])")) return;
        event.preventDefault();
        open();
      } else if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target)) {
        if (document.querySelector("dialog[open]")) return;
        event.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Idle prefetch of the dialog code ~3 s after load (not the index: that waits for intent).
  useEffect(() => {
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    const timer = window.setTimeout(() => ric(() => preloadSearch(false)), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <SearchContext.Provider value={value}>
      {children}
      {mounted && <SearchDialog open={isOpen} onClose={close} initialQuery={query} />}
    </SearchContext.Provider>
  );
}
