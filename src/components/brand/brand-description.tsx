"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Brand description (DESIGN §8.5 #2): max 60ch, clamped to 3 lines with "Baca lagi" only when the
 * text really overflows (measured after mount; the server renders the clamp without a button).
 */
export function BrandDescription({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const id = useId();
  const [overflows, setOverflows] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollHeight > el.clientHeight + 1);
    measure();
    const ro = new ResizeObserver(() => {
      if (!el.classList.contains("line-clamp-3")) return;
      measure();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={className}>
      <p ref={ref} id={id} className={cn("max-w-[60ch] text-body text-ink-2", !open && "line-clamp-3")}>
        {text}
      </p>
      {(overflows || open) && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="mt-1 inline-flex min-h-11 items-center text-label text-telang underline-offset-4 hover:underline"
        >
          {open ? "Tutup balik" : "Baca lagi"}
        </button>
      )}
    </div>
  );
}
