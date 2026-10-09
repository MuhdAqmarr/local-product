"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";

/**
 * Brand description (DESIGN §8.5 #2): max 60ch, clamped to 3 lines with "Read more" only when the
 * text really overflows. The button is always in the HTML and CSS decides before first paint
 * whether it shows (brand-profile.css: a scroll timeline on the clamped text is only active while it
 * hides overflow), so it never pushes the page down at hydration (CLS). Browsers without scroll-driven
 * animations fall back to the JS measurement (`data-show`).
 */
export function BrandDescription({ text, className }: { text: string; className?: string }) {
  const t = useI18n().m.brands.profile;
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
    <div className={cn("brand-desc", className)}>
      <p ref={ref} id={id} className={cn("brand-desc-text max-w-[60ch] text-body text-ink-2", !open && "line-clamp-3")}>
        {text}
      </p>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        data-show={overflows || open ? "" : undefined}
        onClick={() => setOpen((v) => !v)}
        className="brand-desc-more text-label text-telang underline-offset-4 hover:underline"
      >
        {open ? t.readLess : t.readMore}
      </button>
    </div>
  );
}
