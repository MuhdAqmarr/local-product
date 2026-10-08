"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { CategorySlug, ProductCardData, TierSlug } from "./types";

/**
 * "Simpan" list kept in localStorage. Each viewer's own convenience: it may be
 * empty or unavailable (private mode, blocked storage), so every access is guarded.
 */
export interface SavedProduct {
  kind: "product";
  id: string;
  savedAt: number;
  product: ProductCardData;
}

export interface SavedBrand {
  kind: "brand";
  id: string;
  savedAt: number;
  brand: { slug: string; name: string; category: CategorySlug; tier: TierSlug };
}

export type SavedItem = SavedProduct | SavedBrand;
export type NewSavedItem = Omit<SavedProduct, "savedAt"> | Omit<SavedBrand, "savedAt">;

const KEY = "lokallah:saved:v1";
const EMPTY: SavedItem[] = [];
const listeners = new Set<() => void>();
let cache: SavedItem[] | null = null;

function read(): SavedItem[] {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? (parsed as SavedItem[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(items: SavedItem[]) {
  cache = items;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Storage full or blocked: the in-memory list still works for this visit.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const brandSavedId = (slug: string) => `brand:${slug}`;

export function useSaved() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);

  const isSaved = useCallback((id: string) => items.some((item) => item.id === id), [items]);

  /** Returns true when the item is now saved, false when it was removed. */
  const toggle = useCallback((item: NewSavedItem): boolean => {
    const current = read();
    const exists = current.some((i) => i.id === item.id);
    write(exists ? current.filter((i) => i.id !== item.id) : [{ ...item, savedAt: Date.now() } as SavedItem, ...current]);
    return !exists;
  }, []);

  const remove = useCallback((id: string) => write(read().filter((i) => i.id !== id)), []);
  const clear = useCallback(() => write([]), []);

  return { items, count: items.length, isSaved, toggle, remove, clear };
}
