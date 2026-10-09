"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { prefersLessMotion } from "@/components/providers/motion-pref";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";

/**
 * Rotating Gochi Hand loading line (DESIGN §9.6; `common.feedback.loadingLines`), every 2.5 s with an
 * opacity crossfade. Decorative (`aria-hidden`); the skeleton region carries `aria-busy` + one sr-only "Loading…".
 * Reduced motion: one fixed line.
 * The text renders on the client only. A prerendered page carries its loading.tsx fallback in the
 * HTML (swapped out before it ever paints), and server-rendering the line there made every page
 * fetch Gochi Hand next to its first paint.
 */
export function LoadingLine({ className, start = 0 }: { className?: string; start?: number }) {
  const lines = useI18n().m.common.feedback.loadingLines;
  const [i, setI] = useState(start % lines.length);
  const onClient = useSyncExternalStore(noop, isClient, isServer);
  useEffect(() => {
    if (prefersLessMotion()) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % lines.length), 2500);
    return () => window.clearInterval(id);
  }, [lines.length]);
  return (
    <p aria-hidden className={cn("hand text-hand inline-block min-h-[1.2em]", className)}>
      {onClient && (
        <span key={i} className="inline-block animate-[fade-in_300ms_var(--ease-out-soft)_both]">
          {lines[i % lines.length]}
        </span>
      )}
    </p>
  );
}

const noop = () => () => {};
const isClient = () => true;
const isServer = () => false;
