"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { popStyle } from "@/components/ui/pop";
import { useMotionPref } from "@/components/providers/motion-pref";
import { cn } from "@/lib/utils";
import { preloadSearch, useSearch } from "./search-provider";

/** The static label (also what screen readers get) and the cycling examples (DESIGN §9.1). */
const PLACEHOLDER = "Cari jenama, produk, kategori…";
const EXAMPLES = ["Cari “sambal bilis”…", "Cari “tudung bawal”…", "Cari “kopi tenom”…", "Cari “sunscreen”…", "Cari “kasut sekolah”…", "Cari “lilin wangi”…"];
const START_MS = 1200;
const EVERY_MS = 3000;

export interface HeroSearchPillProps {
  /** Oyen's paws + head, peeking over the pill's top edge (server-rendered art). */
  peek?: ReactNode;
  className?: string;
}

/**
 * Home hero search pill (DESIGN §6.4, §7.4): 56 px white pop pill that opens the search dialog.
 * After 1.2 s the hint cycles through real-sounding examples every 3 s (old slides up, new slides
 * in, 380 ms); it pauses while the pill is focused or hovered, the tab is hidden, or motion is
 * reduced. The accessible name never changes.
 */
export function HeroSearchPill({ peek, className }: HeroSearchPillProps) {
  const { open } = useSearch();
  const reduced = useMotionPref() === "always";
  // index -1 = the static placeholder; prev = what is sliding out (null before the first swap)
  const [{ index, prev }, setSlot] = useState<{ index: number; prev: number | null }>({ index: -1, prev: null });
  const paused = useRef(false);

  useEffect(() => {
    if (reduced) return;
    let interval: number | undefined;
    const step = () => {
      if (paused.current || document.hidden) return;
      setSlot((s) => ({ index: (s.index + 1) % EXAMPLES.length, prev: s.index }));
    };
    const start = window.setTimeout(() => {
      step();
      interval = window.setInterval(step, EVERY_MS);
    }, START_MS);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [reduced]);

  const shown = reduced || index < 0 ? PLACEHOLDER : EXAMPLES[index];
  const leaving = reduced || prev == null ? null : prev < 0 ? PLACEHOLDER : EXAMPLES[prev];
  const hold = () => (paused.current = true);
  const release = () => (paused.current = false);

  return (
    <div className={cn("relative", className)}>
      {peek && (
        <span aria-hidden className="home-peek intro-peek" style={{ ["--d" as string]: "650ms" }}>
          {peek}
        </span>
      )}
      <button
        type="button"
        onClick={() => open()}
        onPointerEnter={() => {
          hold();
          preloadSearch();
        }}
        onPointerLeave={release}
        onFocus={() => {
          hold();
          preloadSearch();
        }}
        onBlur={release}
        onTouchStart={() => preloadSearch()}
        aria-haspopup="dialog"
        aria-label="Cari jenama atau produk"
        className="pop flex w-full"
        style={popStyle({ offset: 4 })}
      >
        <span className="pop-face h-14 w-full !justify-start gap-3 bg-putih pr-2 pl-5 text-ink">
          <Search aria-hidden size={20} strokeWidth={2.25} className="shrink-0" />
          <span aria-hidden className="relative h-6 min-w-0 flex-1 overflow-hidden text-left text-body text-ink-soft">
            {leaving != null && (
              <span key={`out-${prev}`} className="home-example" data-state="out">
                {leaving}
              </span>
            )}
            <span key={`in-${index}`} className="home-example" data-state={prev == null ? undefined : "in"}>
              {shown}
            </span>
          </span>
          <span className="grid h-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-bandung px-4 text-label text-ink">Cari</span>
        </span>
      </button>
    </div>
  );
}
