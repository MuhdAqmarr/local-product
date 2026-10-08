// src/lib/motion.ts — motion tokens + shared variants for LokalLah! ("Kedai Oyen: Comel & Laju")
// Import only from "motion/react". Components render `m.*` under <LazyMotion features={domAnimation} strict>.
// Never use `layout` / `layoutId` (not in domAnimation). Animate transform + opacity only.
import { arc, stagger, type Transition, type Variants } from "motion/react";

/** Seconds. CSS mirror: --dur-* in globals.css. */
export const dur = {
  tap: 0.09, // press-in feedback
  fast: 0.15, // hover, chip toggle, overlay fade, exits
  base: 0.22, // popovers, crossfades, tab panels
  slow: 0.32, // enters: toasts, sheets, filter pills
  reveal: 0.42, // in-view rises
  hero: 0.7, // hero pieces, rail nudge hint
  roll: 0.9, // odometer roll
} as const;

/** Cubic beziers. CSS mirror: --ease-* tokens. */
export const ease = {
  out: [0.22, 1, 0.36, 1], // arrivals, settles
  in: [0.55, 0, 1, 0.45], // departures
  inOut: [0.65, 0, 0.35, 1], // moves
  pop: [0.34, 1.56, 0.64, 1], // sticker overshoot
  sine: [0.37, 0, 0.63, 1], // ambient
} as const;

/** Two materials: PAPER (stickers, hearts, stamps) bounces; FURNITURE (sheets, pages, panels) glides. */
export const spring = {
  snappy: { type: "spring", visualDuration: 0.22, bounce: 0.15 }, // indicators, chips, header, FAB
  bouncy: { type: "spring", visualDuration: 0.36, bounce: 0.45 }, // paper: heart, stickers, toasts, badges
  wobble: { type: "spring", visualDuration: 0.5, bounce: 0.55 }, // tier cop slam, Oyen reactions
  gentle: { type: "spring", visualDuration: 0.4, bounce: 0.08 }, // furniture: sheets, modal, big panels
} as const satisfies Record<string, Transition>;

/** px */
export const dist = { micro: 8, reveal: 16, rail: 24, toast: 16, lift: 3, route: 32 } as const;

/** Stagger gaps (s). Never animate more than MAX_STAGGERED children in one group. */
export const gap = { rail: 0.045, group: 0.06, hero: 0.07, particles: 0.015 } as const;
export const MAX_STAGGERED = 6;

/** In-view animations run once. */
export const viewportOnce = { once: true, amount: 0.3, margin: "0px 0px -10% 0px" } as const;

/** Default for <MotionConfig transition>. */
export const defaultTransition: Transition = { duration: 0.36, ease: ease.out };

/* ------------------------------------------------------------------ */
/* Shared variants (state names are always "hidden" -> "show" [-> "exit"]) */
/* ------------------------------------------------------------------ */

/** Section headers, feature blocks. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: dist.reveal },
  show: { opacity: 1, y: 0, transition: { duration: dur.reveal, ease: ease.out } },
};

/** Opacity only (tab panels, result swaps, anything big). */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: dur.base, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: dur.fast, ease: ease.in } },
};

/** Rail items (first 6 only): "there's more to the side". */
export const slideInX: Variants = {
  hidden: { opacity: 0, x: dist.rail },
  show: { opacity: 1, x: 0, transition: { duration: dur.slow + 0.04, ease: ease.out } },
};

/** Parent for any staggered group. Uses Motion 14 `delayChildren: stagger()` (staggerChildren is deprecated). */
export const staggerContainer = (interval: number = gap.group, startDelay = 0): Variants => ({
  hidden: {},
  show: { transition: { delayChildren: stagger(interval, { startDelay }) } },
});

/** Paper pop: stickers, badges, "Check" in chips. `custom` = resting rotation in degrees. */
export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -12 },
  show: (rotate: number = 0) => ({ opacity: 1, scale: 1, rotate, transition: spring.bouncy }),
  exit: { opacity: 0, scale: 0.85, transition: { duration: dur.fast, ease: ease.in } },
};

/** Tier "cop" stamp slam: an official stage is stamped. Pair with an ink ring scaling .6 -> 1.25, opacity .5 -> 0. */
export const stampIn: Variants = {
  hidden: { opacity: 0, scale: 1.35, rotate: -14 },
  show: { opacity: 1, scale: 1, rotate: -3, transition: spring.wobble },
};

/** One-shot wiggle: "this is tappable" (tier badge, monogram on card hover). Trigger with animate="wiggle". */
export const wiggle: Variants = {
  rest: { rotate: 0 },
  wiggle: { rotate: [0, -8, 6, -3, 0], transition: { duration: 0.5, ease: ease.out } },
};

/** Heart save: squash then overshoot; the fill swaps at the squash frame. */
export const heartSave: Variants = {
  off: { scale: 1, transition: spring.gentle },
  on: { scale: [1, 0.7, 1.3, 1], transition: { duration: 0.42, times: [0, 0.25, 0.65, 1], ease: ease.out } },
};

/** Catch bump on the Simpan target when the flying heart lands. */
export const bump: Variants = {
  rest: { scale: 1 },
  bump: { scale: [1, 1.22, 1], transition: { duration: 0.32, ease: ease.out } },
};

/** Toasts (AnimatePresence, one at a time). */
export const toast: Variants = {
  hidden: { opacity: 0, y: dist.toast, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring.bouncy },
  exit: { opacity: 0, y: 8, transition: { duration: 0.14, ease: ease.in } },
};

/** Active-filter pills and other removable chips. Siblings snap (no layout animation). */
export const chipPresence: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: spring.snappy },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.12, ease: ease.in } },
};

/** FAB / back-to-top. */
export const fab: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: spring.snappy },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.12, ease: ease.in } },
};

/** Mobile one-time rail swipe hint (once per session, after the cascade). */
export const nudgeX: Transition = { duration: dur.hero, ease: ease.inOut, delay: 0.6 };
export const nudgeKeyframes = { x: [0, -28, 0] } as const;

/* ------------------------------------------------------------------ */
/* Fly-to-Simpan (first 3 saves per session; afterwards bump + count only) */
/* ------------------------------------------------------------------ */
export const FLY_TEACH_LIMIT = 3;
export const flightPath = arc({ strength: 0.5, peak: 0.35, rotate: 0.3 }); // create once, at module scope
export const flightTransition: Transition = { duration: 0.56, ease: ease.out, path: flightPath };
/** Usage: animate(ghostEl, { x: dx, y: dy, scale: 0.6 }, flightTransition) */
