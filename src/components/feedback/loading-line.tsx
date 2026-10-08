"use client";

import { useEffect, useState } from "react";
import { prefersLessMotion } from "@/components/providers/motion-pref";
import { cn } from "@/lib/utils";

export const LOADING_LINES = [
  "Oyen tengah susun rak…",
  "Kejap, tengah kira diskaun…",
  "Tengah usha kedai rasmi…",
  "Sabar jap, barang baru sampai…",
  "Tengah tarik teh… jap.",
  "Tauke tengah tulis kad harga…",
] as const;

/**
 * Rotating Gochi Hand loading line (DESIGN §9.6), every 2.5 s with an opacity crossfade.
 * Decorative (`aria-hidden`); the skeleton region carries `aria-busy` + one sr-only "Sedang dimuatkan…".
 * Reduced motion: one fixed line.
 */
export function LoadingLine({ className, start = 0 }: { className?: string; start?: number }) {
  const [i, setI] = useState(start % LOADING_LINES.length);
  useEffect(() => {
    if (prefersLessMotion()) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % LOADING_LINES.length), 2500);
    return () => window.clearInterval(id);
  }, []);
  return (
    <p aria-hidden className={cn("hand text-hand inline-block min-h-[1.2em]", className)}>
      <span key={i} className="inline-block animate-[fade-in_300ms_var(--ease-out-soft)_both]">
        {LOADING_LINES[i]}
      </span>
    </p>
  );
}
