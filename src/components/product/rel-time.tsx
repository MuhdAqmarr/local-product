"use client";

import { useSyncExternalStore } from "react";
import { timeAgo } from "@/lib/format";

/**
 * One shared minute clock for every relative time on the page (cards can number in the
 * hundreds, so they share a single interval instead of one effect each).
 * Server + hydration render against `base` (the catalog's syncedAt), so markup is stable;
 * after hydration React re-renders with the real clock. No hydration mismatch.
 */
let now = 0;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function tick() {
  now = Date.now();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      if (!document.hidden) tick();
    }, 60_000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => now || (now = Date.now());
const getServerSnapshot = () => 0;

/** Current time on the client after hydration; `fallback` (e.g. syncedAt ms) before that. */
export function useNow(fallback: number): number {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return value || fallback;
}

export function RelTime({ iso, base, prefix = "", className }: { iso: string; base: string; prefix?: string; className?: string }) {
  const at = useNow(Date.parse(base));
  return (
    <time dateTime={iso} className={className} suppressHydrationWarning>
      {prefix}
      {timeAgo(iso, at)}
    </time>
  );
}
