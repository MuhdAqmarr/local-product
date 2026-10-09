"use client";

import * as m from "motion/react-m";
import { useScroll } from "motion/react";

/** /about reading progress (DESIGN §7.7 #7): scaleX = page scroll progress. Transform-only, no React state per frame. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <div aria-hidden="true" className="about-progress">
      <m.div className="h-full origin-left bg-kuih-lapis" style={{ scaleX: scrollYProgress }} />
    </div>
  );
}
