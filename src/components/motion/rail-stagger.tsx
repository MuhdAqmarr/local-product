"use client";

import { Children, isValidElement, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import * as m from "motion/react-m";
import { useInView, type Variants } from "motion/react";
import { MAX_STAGGERED, dur, ease, gap, slideInX, staggerContainer } from "@/lib/motion";
import { prefersLessMotion } from "@/components/providers/motion-pref";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const HINT_KEY = "lokallah:rail-hint";

const container = staggerContainer(gap.rail, 0.05);
const item: Variants = {
  hidden: { ...(slideInX.hidden as object), transition: { duration: 0 } },
  show: slideInX.show,
};

export interface RailStaggerProps {
  /** Rail items, one child per track cell (cards, end card). */
  children: ReactNode;
  /** Classes for the track (`div[role=region]`). The track is the horizontal scroller. */
  className?: string;
  /** Classes for each cell (`div`), e.g. `snap-start`. */
  itemClassName?: string;
  /** Accessible name for the scroll region: "{title}, skrol mendatar". */
  label: string;
  /** Mobile-only, once-per-session swipe hint after the cascade (first rail on Home only). */
  hint?: boolean;
  /** Extra attributes for the track, e.g. `style={{ scrollTimelineName: "--rail" }}`. */
  style?: React.CSSProperties;
  id?: string;
}

/**
 * SSR-visible rail cascade. Items render visible on the server; only if the rail is
 * below the fold at hydration do the first 6 cells flip to "hidden" (instantly,
 * offscreen) and then slide in with a stagger when the rail scrolls into view.
 * The rest of the cells never animate.
 */
export function RailStagger({ children, className, itemClassName, label, hint = false, style, id }: RailStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"show" | "hidden">("show");
  const armed = useRef(false);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersLessMotion()) return;
    if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
      armed.current = true;
      setState("hidden");
    }
  }, []);

  useEffect(() => {
    if (inView && armed.current) setState("show");
  }, [inView]);

  // One-time swipe hint (mobile, once per session) using WAAPI: zero bundle cost.
  useEffect(() => {
    if (!hint || !inView) return;
    const el = ref.current;
    if (!el || prefersLessMotion() || !window.matchMedia("(max-width: 1023px)").matches) return;
    try {
      if (window.sessionStorage.getItem(HINT_KEY)) return;
      window.sessionStorage.setItem(HINT_KEY, "1");
    } catch {
      return;
    }
    const cells = Array.from(el.children).slice(0, MAX_STAGGERED) as HTMLElement[];
    const delay = (armed.current ? MAX_STAGGERED * gap.rail + dur.slow : 0) * 1000 + 600;
    const animations = cells.map((cell) =>
      cell.animate([{ translate: "0 0" }, { translate: "-28px 0" }, { translate: "0 0" }], {
        duration: dur.hero * 1000,
        delay,
        easing: `cubic-bezier(${ease.inOut.join(",")})`,
      }),
    );
    const cancel = () => animations.forEach((a) => a.cancel());
    el.addEventListener("pointerdown", cancel, { once: true });
    return () => {
      cancel();
      el.removeEventListener("pointerdown", cancel);
    };
  }, [hint, inView]);

  const cells = Children.toArray(children);

  return (
    <m.div
      ref={ref}
      id={id}
      className={className}
      style={style}
      role="region"
      aria-label={label}
      tabIndex={0}
      data-lenis-prevent-horizontal=""
      variants={container}
      initial={false}
      animate={state}
    >
      {cells.map((child, index) => {
        const key = isValidElement(child) && child.key != null ? child.key : index;
        return index < MAX_STAGGERED ? (
          <m.div key={key} className={itemClassName} variants={item}>
            {child}
          </m.div>
        ) : (
          <div key={key} className={itemClassName}>
            {child}
          </div>
        );
      })}
    </m.div>
  );
}
