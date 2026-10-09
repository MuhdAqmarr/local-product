"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "@/components/ui/lucide";
import { prefersLessMotion } from "@/components/providers/motion-pref";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";

export interface RailControlsProps {
  /** id of the rail track (the horizontal scroller). */
  trackId: string;
  className?: string;
}

const BTN =
  "grid size-10 place-items-center rounded-full border-[1.5px] border-garis-kuat bg-putih text-ink transition-[transform,opacity] duration-150 ease-out-soft hover:-translate-y-px active:scale-90 disabled:cursor-default disabled:opacity-40 disabled:hover:translate-y-0";

/**
 * Desktop prev/next for a rail (DESIGN §6.11): scroll by 0.85 × width, disabled at the ends.
 * Ends are detected with an IntersectionObserver on the first/last cells: no scroll listener.
 */
export function RailControls({ trackId, className }: RailControlsProps) {
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const t = useI18n().m.common.rail;

  useEffect(() => {
    const track = document.getElementById(trackId);
    const first = track?.firstElementChild;
    const last = track?.lastElementChild;
    if (!track || !first || !last) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const visible = e.intersectionRatio > 0.9;
          if (e.target === first) setAtStart(visible);
          if (e.target === last) setAtEnd(visible);
        }
      },
      { root: track, threshold: [0, 0.9, 1] },
    );
    io.observe(first);
    io.observe(last);
    return () => io.disconnect();
  }, [trackId]);

  const go = (dir: -1 | 1) => {
    const track = document.getElementById(trackId);
    if (!track) return;
    track.scrollBy({ left: dir * track.clientWidth * 0.85, behavior: prefersLessMotion() ? "auto" : "smooth" });
  };

  return (
    <div className={cn("hidden items-center gap-2 lg:flex", className)}>
      <button type="button" className={BTN} onClick={() => go(-1)} disabled={atStart} aria-label={t.left} aria-controls={trackId}>
        <ChevronLeft aria-hidden="true" size={20} strokeWidth={2.25} />
      </button>
      <button type="button" className={BTN} onClick={() => go(1)} disabled={atEnd} aria-label={t.right} aria-controls={trackId}>
        <ChevronRight aria-hidden="true" size={20} strokeWidth={2.25} />
      </button>
    </div>
  );
}
