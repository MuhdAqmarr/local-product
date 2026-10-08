"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import * as m from "motion/react-m";
import { useScroll, useTransform } from "motion/react";
import { useMotionPref } from "@/components/providers/motion-pref";

/**
 * Desktop-only hero parallax (DESIGN §7.7 #2): ≥ 1024 px, fine pointer, motion allowed.
 * One passive `useScroll()` over the first ~640 px of the page (the hero sits at the top).
 * - `mesh`: the `.mesh` wrapper sinks 0 → 80 px (never the blobs themselves)
 * - `wau`:  the kite rises 0 → −140 px and tilts −4° → −14° ("naik!")
 * - `fan`:  the live deal cards rise 0 → −40 px
 * Everywhere else (phones, touch, reduced motion) it renders the resting pose.
 */
const LAYERS = {
  mesh: { y: [0, 80], rotate: [0, 0] },
  wau: { y: [0, -140], rotate: [-4, -14] },
  fan: { y: [0, -40], rotate: [0, 0] },
} as const;

const RANGE = [0, 640];
const QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const isDesktop = () => window.matchMedia(QUERY).matches;
const notOnServer = () => false;

export function HeroParallax({ layer, className, children }: { layer: keyof typeof LAYERS; className?: string; children: ReactNode }) {
  const reduced = useMotionPref() === "always";
  const desktop = useSyncExternalStore(subscribe, isDesktop, notOnServer);
  const { scrollY } = useScroll();
  const spec = LAYERS[layer];
  const y = useTransform(scrollY, RANGE, [...spec.y], { clamp: true });
  const rotate = useTransform(scrollY, RANGE, [...spec.rotate], { clamp: true });

  const live = desktop && !reduced;
  const rest = spec.rotate[0];
  return (
    <m.div aria-hidden={layer === "mesh" ? true : undefined} className={className} style={live ? { y, rotate } : { y: 0, rotate: rest }}>
      {children}
    </m.div>
  );
}
