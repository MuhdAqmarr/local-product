"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/client";
import { timeAgo } from "@/lib/format";
import { formatClock, formatDateTime } from "@/lib/freshness";

export interface LiveTimeProps {
  /** ISO timestamp. */
  iso: string;
  /** Text printed by the server (and before mount). Default: absolute clock time ("3:40 PM" / "3:40 PTG"). */
  initial?: string;
  className?: string;
}

/** Subscribe to a 60 s clock that pauses while the tab is hidden. Returns null until mounted. */
export function useNow(intervalMs = 60_000): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    let id: number | undefined;
    const tick = () => setNow(Date.now());
    const start = () => {
      tick();
      window.clearInterval(id);
      id = window.setInterval(tick, intervalMs);
    };
    const onVisibility = () => (document.hidden ? window.clearInterval(id) : start());
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs]);
  return now;
}

/**
 * `<time>` that the server prints as an absolute time and the client upgrades to
 * "12 min ago" / "12 min lepas" after mount, refreshing every 60 s (paused when hidden). No hydration mismatch.
 */
export function LiveTime({ iso, initial, className }: LiveTimeProps) {
  const now = useNow();
  const locale = useLocale();
  const text = now == null ? (initial ?? formatClock(iso, locale)) : timeAgo(iso, now, locale);
  return (
    <time dateTime={iso} title={formatDateTime(iso, locale)} className={className} suppressHydrationWarning>
      {text}
    </time>
  );
}
