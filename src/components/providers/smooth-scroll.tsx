"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { ReactLenis, useLenis } from "lenis/react";
import { cancelFrame, frame } from "motion/react";

/** One 60 Hz frame (ms): the step Lenis takes on the first frame after an idle gap. */
const FRAME_MS = 1000 / 60;

/**
 * `lerp: 0.25` (DESIGN §7.3): still a Lenis glide, but a wheel notch settles in ≈ 0.38 s and a
 * trackpad flick in ≈ 0.25 s (0.12 took 0.77 s / 0.73 s and coasted on top of the OS momentum),
 * and the page trails a spinning wheel by less: light, not floaty.
 */
const OPTIONS = {
  autoRaf: false,
  lerp: 0.25,
  smoothWheel: true,
  syncTouch: false,
  anchors: { offset: -96 },
  allowNestedScroll: true,
  stopInertiaOnNavigate: true,
  autoToggle: true,
  respectReducedMotion: true,
} as const;

/** Run `onScroll` after every `lenis.scrollTo` (wheel, anchors, programmatic). Returns the undo. */
function onScrollTo(lenis: Lenis, onScroll: () => void) {
  const scrollTo = lenis.scrollTo;
  lenis.scrollTo = (...args: Parameters<Lenis["scrollTo"]>) => {
    scrollTo.apply(lenis, args);
    onScroll();
  };
  return () => {
    lenis.scrollTo = scrollTo;
  };
}

/**
 * Lenis rides Motion's frame loop, but only while it is actually animating: every Lenis scroll
 * (wheel, anchor, `lenis.scrollTo`) goes through `scrollTo`, which starts the loop; the loop
 * cancels itself once Lenis is no longer smooth-scrolling. Idle pages run zero rAF callbacks.
 * Mounted by <Providers> only for a fine pointer with full motion (phones keep native momentum).
 */
export function SmoothScroll() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    let running = false;

    const update = ({ timestamp }: { timestamp: number }) => {
      lenis.raf(timestamp);
      if (lenis.isScrolling !== "smooth") {
        running = false;
        cancelFrame(update);
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      // Lenis measures the step from its last raf; after an idle gap, restart the clock one frame
      // back. Motion stamps frames with performance.now() at processing time, and wheel input is
      // dispatched right before rAF, so a clock started "now" gave the first frame a ~0 ms step: the
      // page only began to move a frame later (≈ +17 ms of input latency on every gesture).
      lenis.time = performance.now() - FRAME_MS;
      frame.update(update, true);
    };

    const restore = onScrollTo(lenis, start);
    return () => {
      cancelFrame(update);
      restore();
    };
  }, [lenis]);

  return <ReactLenis root options={OPTIONS} />;
}
