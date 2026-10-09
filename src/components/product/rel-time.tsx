"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "@/i18n/client";
import { fmt } from "@/i18n/format";
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

/**
 * Relative time in the page language. `template` wraps it ("Launched {time}" → "Launched 3 days ago");
 * `prefix` is a plain string in front (kept for older callers).
 */
export function RelTime({ iso, base, prefix = "", template, className }: { iso: string; base: string; prefix?: string; template?: string; className?: string }) {
  const at = useNow(Date.parse(base));
  const ago = timeAgo(iso, at, useLocale());
  return (
    <time dateTime={iso} className={className} suppressHydrationWarning>
      {prefix}
      {template ? fmt(template, { time: ago }) : ago}
    </time>
  );
}
