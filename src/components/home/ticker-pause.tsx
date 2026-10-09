"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { Pause, Play } from "@/components/ui/lucide";

/**
 * The ticker's moving strip + its Pause/Play toggle (DESIGN §6.19, WCAG 2.2.2). The pause lives
 * in React state and lands on `.marquee[data-paused]`, so it never fights the offscreen
 * auto-pause that RevealObserver puts on the outer `[data-ambient]` band.
 */
export function TickerPause({ children, duration }: { children: ReactNode; duration: number }) {
  const [paused, setPaused] = useState(false);
  return (
    <>
      <div className="marquee min-w-0 flex-1" data-paused={paused ? "" : undefined} style={{ "--marquee-dur": `${duration}s` } as CSSProperties}>
        {children}
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? "Sambung ticker" : "Jeda ticker"}
        className="home-ticker-toggle relative grid size-8 shrink-0 place-items-center rounded-full border-[1.5px] border-ink-dim text-santan transition-colors duration-150 hover:bg-santan/10 before:absolute before:-inset-1.5 before:content-['']"
      >
        {paused ? <Play aria-hidden size={14} strokeWidth={2.5} /> : <Pause aria-hidden size={14} strokeWidth={2.5} />}
      </button>
    </>
  );
}
