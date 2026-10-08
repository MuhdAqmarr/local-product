"use client";

import { useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

const TUCK_AT = 24;
const HIDE_AT = 120;
const MIN_DELTA = 6;

/**
 * Header scroll behaviour (DESIGN §6.2, §7.7 #1). Flips two attributes on <html>, only when a
 * threshold or direction changes (no per-frame React state):
 * - `data-awning="tucked"` past 24 px: the awning tucks, the bottom hairline fades in.
 * - `data-header="hidden"` (< 1024 px only) past 120 px when scrolling down by > 6 px; any upward
 *   scroll shows it again. The page's sticky filter bar joins via the `.sticky-stack` class.
 * All movement is CSS transforms in globals.css.
 */
export function HeaderScroll() {
  const { scrollY } = useScroll();
  const last = useRef(0);
  const state = useRef({ tucked: false, hidden: false });

  useMotionValueEvent(scrollY, "change", (y) => {
    const root = document.documentElement;
    const delta = y - last.current;
    last.current = y;

    const tucked = y > TUCK_AT;
    if (tucked !== state.current.tucked) {
      state.current.tucked = tucked;
      if (tucked) root.dataset.awning = "tucked";
      else delete root.dataset.awning;
    }

    let hidden = state.current.hidden;
    if (y <= HIDE_AT) hidden = false;
    else if (delta > MIN_DELTA) hidden = true;
    else if (delta < -2) hidden = false;
    // Keep the header visible while a keyboard user is focused inside the sticky stack.
    const focused = document.activeElement;
    if (hidden && focused?.closest("#site-header, .sticky-stack") && focused.matches(":focus-visible")) hidden = false;
    if (hidden !== state.current.hidden) {
      state.current.hidden = hidden;
      if (hidden) root.dataset.header = "hidden";
      else delete root.dataset.header;
    }
  });

  return null;
}
