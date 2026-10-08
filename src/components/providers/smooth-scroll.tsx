"use client";

import { useEffect, useMemo, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame } from "motion/react";

/** One rAF for the whole site: Lenis rides Motion's frame loop. Phones keep native momentum. */
export function SmoothScroll({ reduce }: { reduce: boolean }) {
  const ref = useRef<LenisRef>(null);

  useEffect(() => {
    const update = ({ timestamp }: { timestamp: number }) => ref.current?.lenis?.raf(timestamp);
    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  const options = useMemo(
    () => ({
      autoRaf: false,
      lerp: reduce ? 1 : 0.12,
      smoothWheel: !reduce,
      syncTouch: false,
      anchors: { offset: -96 },
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      autoToggle: true,
      respectReducedMotion: true,
    }),
    [reduce],
  );

  return <ReactLenis root ref={ref} options={options} />;
}
