"use client";

import { useEffect } from "react";
import { LazyMotion, MotionConfig } from "motion/react";
import { defaultTransition } from "@/lib/motion";
import { SmoothScroll } from "./smooth-scroll";
import { useMotionPref } from "./motion-pref";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * Root client providers. Keep the tree shape constant: the motion switch only
 * changes options, it never remounts the page.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const pref = useMotionPref();

  useEffect(() => {
    // iOS Safari only fires :active (the pop press) when a touchstart listener exists.
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    return () => document.removeEventListener("touchstart", noop);
  }, []);

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion={pref} transition={defaultTransition}>
        <SmoothScroll reduce={pref === "always"} />
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
