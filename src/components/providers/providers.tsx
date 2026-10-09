"use client";

import { useEffect, useState } from "react";
import { LazyMotion, MotionConfig } from "motion/react";
import { defaultTransition } from "@/lib/motion";
import { SmoothScroll } from "./smooth-scroll";
import { useMotionPref } from "./motion-pref";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/** Lenis only smooths the wheel: mount it for a fine pointer, never on touch-only devices. */
function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return fine;
}

/**
 * Root client providers. Keep the tree shape constant: the motion switch only
 * changes options, it never remounts the page. SmoothScroll sits in a fixed slot
 * (false on the server and on phones), so mounting it never remounts children.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const pref = useMotionPref();
  const fine = useFinePointer();

  useEffect(() => {
    // iOS Safari only fires :active (the pop press) when a touchstart listener exists.
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    return () => document.removeEventListener("touchstart", noop);
  }, []);

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion={pref} transition={defaultTransition}>
        {fine && pref !== "always" && <SmoothScroll />}
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
