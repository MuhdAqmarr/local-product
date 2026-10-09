"use client";

import { useEffect } from "react";

const TUCK_AT = 24;
const HIDE_AT = 120;
const MIN_DELTA = 6;

/**
 * Header scroll behaviour (DESIGN §6.2, §7.7 #1). Flips two attributes on <html>, only when a
 * threshold or direction changes (no per-frame React state):
 * - `data-awning="tucked"` past 24 px: the awning tucks, the bottom hairline fades in.
 * - `data-header="hidden"` (< 1024 px only) past 120 px when scrolling down by > 6 px; any upward
 *   scroll shows it again. The page's sticky filter bar joins via the `.sticky-stack` class.
 * All movement is CSS transforms in globals.css. One passive `scroll` listener, read once per frame
 * with rAF (no Motion scroll machinery: this is only a threshold check, QA F08).
 */
export function HeaderScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const state = { tucked: false, hidden: false };
    let last = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;
      last = y;

      const tucked = y > TUCK_AT;
      if (tucked !== state.tucked) {
        state.tucked = tucked;
        if (tucked) root.dataset.awning = "tucked";
        else delete root.dataset.awning;
      }

      let hidden = state.hidden;
      if (y <= HIDE_AT) hidden = false;
      else if (delta > MIN_DELTA) hidden = true;
      else if (delta < -2) hidden = false;
      // Keep the header visible while a keyboard user is focused inside the sticky stack.
      const focused = document.activeElement;
      if (hidden && focused?.closest("#site-header, .sticky-stack") && focused.matches(":focus-visible")) hidden = false;
      if (hidden !== state.hidden) {
        state.hidden = hidden;
        if (hidden) root.dataset.header = "hidden";
        else delete root.dataset.header;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // A restored or anchored scroll position may already be past the thresholds.
    if (last > TUCK_AT) {
      last = 0;
      update();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
