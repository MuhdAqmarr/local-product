"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import * as m from "motion/react-m";
import { useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { RotateCcw } from "@/components/ui/lucide";
import { prefersLessMotion, useMotionPref } from "@/components/providers/motion-pref";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
/** Scroll progress at which stations 1–3 switch on. */
const THRESHOLDS = [0.15, 0.5, 0.85] as const;
const reached = (v: number) => THRESHOLDS.filter((t) => v >= t).length;

export interface ScrollStationsProps {
  /** One server-rendered node per station (max 3); each is wrapped in `<li data-active>`. */
  steps: ReactNode[];
  /** Accessible name of the list. */
  label: string;
  className?: string;
  /** Classes for each `<li>`. */
  itemClassName?: string;
  /**
   * Classes positioning the connector from a station to the next one, inside its `<li>`
   * (vertical on phones, horizontal from `lg`), e.g. `left-[26px] top-14 bottom-0 w-1 lg:…`.
   */
  connectorClassName: string;
  /** The drawn part of the connector (colour/pattern). */
  fillClassName?: string;
  /** Label of the replay button ("Play again" / "Main semula"), shown once everything has played. Omit for no replay. */
  replay?: string;
  /** Extra attributes for every `<li>` (e.g. `data-tier-trigger` so tier icons play their micro on activation). */
  itemAttrs?: Record<`data-${string}`, string>;
}

function Connector({ progress, from, to, playing, className, fillClassName }: { progress: MotionValue<number>; from: number; to: number; playing: boolean; className: string; fillClassName: string }) {
  const amount = useTransform(progress, [from, to], [0, 1], { clamp: true });
  return (
    <span aria-hidden className={cn("pointer-events-none absolute overflow-hidden rounded-full bg-putih/80", className)}>
      <m.span className={cn("absolute inset-0 origin-top rounded-full lg:hidden", fillClassName)} style={{ scaleY: playing ? amount : 1 }} />
      <m.span className={cn("absolute inset-0 hidden origin-left rounded-full lg:block", fillClassName)} style={{ scaleX: playing ? amount : 1 }} />
    </span>
  );
}

/**
 * Scroll-linked stations (DESIGN §7.5 #5 tier journey, #7 explainer). Section progress
 * (`useScroll({ target, offset: ["start 75%", "end 55%"] })`) draws the connector from station to
 * station (`scaleY` on phones, `scaleX` from `lg`) and flips `data-active` on stations 1–3 at
 * .15 / .5 / .85: three state changes in total, each station plays once; the stations' own CSS
 * does the rest. SSR, no-JS and reduced motion: fully drawn, every station active. Only when the
 * list is below the fold at hydration does it reset (offscreen, so invisibly) and play on scroll.
 */
export function ScrollStations({ steps, label, className, itemClassName, connectorClassName, fillClassName = "bg-kuih-lapis", replay, itemAttrs }: ScrollStationsProps) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useMotionPref() === "always";
  const [armed, setArmed] = useState(false);
  const [active, setActive] = useState(steps.length);
  /** Replay: stations re-played one by one, independent of scroll. */
  const [replayAt, setReplayAt] = useState<number | null>(null);
  const timers = useRef<number[]>([]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  /** The furthest the section has been scrolled: the connector draws once and stays drawn. */
  const peak = useMotionValue(0);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersLessMotion()) return;
    if (el.getBoundingClientRect().top > window.innerHeight * 0.75) {
      setArmed(true);
      setActive(reached(scrollYProgress.get()));
    }
  }, []);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > peak.get()) peak.set(v);
    if (!armed) return;
    const n = reached(v);
    setActive((a) => (n > a ? n : a));
  });

  const playing = armed && !reduced;
  const shown = replayAt ?? (playing ? active : steps.length);
  const done = shown >= steps.length;

  const onReplay = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    setReplayAt(0);
    // Let the reset (transition: none) paint, then play the stations one by one.
    timers.current = steps.map((_, i) => window.setTimeout(() => setReplayAt(i + 1), 80 + i * 560));
  };

  return (
    <div className={className}>
      <ol ref={ref} aria-label={label} className="relative lg:grid lg:grid-cols-3">
        {steps.map((step, i) => (
          <li key={i} {...itemAttrs} data-active={i < shown ? "true" : "false"} className={cn("relative", itemClassName)}>
            {i < steps.length - 1 && (
              <Connector
                progress={peak}
                from={THRESHOLDS[i]}
                to={THRESHOLDS[i + 1]}
                playing={playing}
                className={connectorClassName}
                fillClassName={fillClassName}
              />
            )}
            {step}
          </li>
        ))}
      </ol>
      {replay && (
        <div className="mt-2 flex h-11 justify-end">
          {!reduced && done && (
            <button
              type="button"
              onClick={onReplay}
              className="inline-flex min-h-11 animate-[fade-in_200ms_ease-out_both] items-center gap-1.5 rounded-full px-3 text-label text-telang underline-offset-4 hover:underline"
            >
              <RotateCcw aria-hidden size={16} strokeWidth={2.25} />
              {replay}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
