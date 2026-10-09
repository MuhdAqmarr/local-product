"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Search } from "@/components/ui/lucide";
import { popStyle } from "@/components/ui/pop";
import { useMotionPref } from "@/components/providers/motion-pref";
import type { HomeMessages } from "@/i18n/dictionaries/en/home";
import { cn } from "@/lib/utils";
import { preloadSearch, useSearch } from "./search-provider";

/*
 * Copy comes from the `home.search` dictionary (DESIGN §9.1): the static placeholder (also what
 * screen readers get), a short phone version (the full one clips at 360 px, QA F27), the
 * accessible name (contains every visible variant, label-in-name, QA F28) and the cycling examples.
 * Every example must return real results from the catalogue (each matches 10+ products across
 * 2+ brands in the current snapshot); re-check against /api/feed/search when the brand list changes.
 */
const START_MS = 1200;
const EVERY_MS = 3000;

/**
 * The hint and the "Cari" chip are painted as CSS generated content (`data-text`), so the button's
 * text content is empty and its stable aria-label is the whole name: axe/Lighthouse
 * label-content-name-mismatch reads aria-hidden text too, and the cycling examples would otherwise
 * "mismatch" every 3 s (QA F28). The static placeholder has a short phone version (QA F27).
 */
const painted = "truncate before:content-[attr(data-text)]";
function hint(text: string | null, copy: HomeMessages["search"]) {
  if (text != null) return <span className={painted} data-text={text} />;
  return (
    <>
      <span className={`${painted} sm:hidden`} data-text={copy.placeholderShort} />
      <span className={`${painted} hidden sm:inline`} data-text={copy.placeholder} />
    </>
  );
}

export interface HeroSearchPillProps {
  /** Oyen's paws + head, peeking over the pill's top edge (server-rendered art). */
  peek?: ReactNode;
  /** `home.search` in the page language (server-provided, so no MessagesProvider is needed). */
  copy: HomeMessages["search"];
  className?: string;
}

/**
 * Home hero search pill (DESIGN §6.4, §7.4): 56 px white pop pill that opens the search dialog.
 * After 1.2 s the hint cycles through real-sounding examples every 3 s (old slides up, new slides
 * in, 380 ms); it pauses while the pill is focused or hovered, the tab is hidden, or motion is
 * reduced. The accessible name never changes.
 */
export function HeroSearchPill({ peek, copy, className }: HeroSearchPillProps) {
  const examples = copy.examples;
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
      setSlot((s) => ({ index: (s.index + 1) % examples.length, prev: s.index }));
    };
    const start = window.setTimeout(() => {
      step();
      interval = window.setInterval(step, EVERY_MS);
    }, START_MS);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [reduced, examples.length]);

  // null = the static placeholder
  const shown = reduced || index < 0 ? null : examples[index % examples.length];
  const leaving = reduced || prev == null ? undefined : prev < 0 ? null : examples[prev % examples.length];
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
        aria-label={copy.name}
        className="pop flex w-full"
        style={popStyle({ offset: 4 })}
      >
        <span className="pop-face h-14 w-full !justify-start gap-3 bg-putih pr-2 pl-5 text-ink">
          <Search aria-hidden size={20} strokeWidth={2.25} className="shrink-0" />
          <span aria-hidden className="relative h-6 min-w-0 flex-1 overflow-hidden text-left text-body text-ink-soft">
            {leaving !== undefined && (
              <span key={`out-${prev}`} className="home-example" data-state="out">
                {hint(leaving, copy)}
              </span>
            )}
            <span key={`in-${index}`} className="home-example" data-state={prev == null ? undefined : "in"}>
              {hint(shown ?? null, copy)}
            </span>
          </span>
          <span
            aria-hidden
            data-text={copy.button}
            className="grid h-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-bandung px-4 text-label text-ink before:content-[attr(data-text)]"
          />
        </span>
      </button>
    </div>
  );
}
