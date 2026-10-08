"use client";

import { useState, useSyncExternalStore, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import "./art.css";
import { BungaRayaShape } from "./bunga-raya";
import { C } from "./shared";
import { SPARKLE } from "./sparkle";

export type ParticlePreset = "save" | "celebrate";

export interface ParticlesProps {
  /**
   * Fire a burst by changing this to a new positive number (e.g. a click counter).
   * `0` renders nothing. Each burst unmounts itself when its last particle finishes.
   */
  burst: number;
  /**
   * `save`: 6 particles (3 mini hearts + 3 sparkles), 22–28 px travel, 520 ms (§7.6 step 3).
   * `celebrate`: 12 particles (bunga raya + sparkles), 52–76 px travel, 640 ms (suggest success, §7.5 #25).
   */
  preset?: ParticlePreset;
  /** Called once the burst has finished (not called when motion is reduced, since nothing renders). */
  onDone?: () => void;
  className?: string;
}

const HEART = "M12 21C12 21 3 15.5 3 9.5C3 6.5 5.3 4.5 8 4.5C9.8 4.5 11.2 5.5 12 7C12.8 5.5 14.2 4.5 16 4.5C18.7 4.5 21 6.5 21 9.5C21 15.5 12 21 12 21Z";

const PRESETS = {
  save: { count: 6, min: 22, max: 28, px: 12, ms: 520, glyphs: ["heart", "sparkle"] },
  celebrate: { count: 12, min: 52, max: 76, px: 16, ms: 640, glyphs: ["bunga", "sparkle"] },
} as const;

/** Deterministic jitter in [0, 1) so renders stay pure and server/client agree. */
function rand(seed: number) {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  return () => {
    mq.removeEventListener("change", cb);
    mo.disconnect();
  };
}
const reducedNow = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduce";

/**
 * Particle burst (save heart, suggest success). Place inside a `position: relative` element;
 * particles fly out from its centre (transform + opacity only).
 */
export function Particles({ burst, preset = "save", onDone, className }: ParticlesProps) {
  const reduced = useSyncExternalStore(subscribe, reducedNow, () => false);
  const [done, setDone] = useState(0);
  if (!burst || burst === done || reduced) return null;

  const p = PRESETS[preset];
  const step = 360 / p.count;
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      onAnimationEnd={(e) => {
        if ((e.target as HTMLElement).dataset.last !== undefined) {
          setDone(burst);
          onDone?.();
        }
      }}
    >
      {Array.from({ length: p.count }, (_, i) => {
        const r1 = rand(burst * 97 + i * 13);
        const r2 = rand(burst * 131 + i * 7 + 3);
        const angle = ((i * step + (r1 * 20 - 10) - 90) * Math.PI) / 180;
        const dist = p.min + r2 * (p.max - p.min);
        const glyph = p.glyphs[i % 2];
        const style = {
          "--dx": `${(Math.cos(angle) * dist).toFixed(1)}px`,
          "--dy": `${(Math.sin(angle) * dist).toFixed(1)}px`,
          "--k": i,
          "--rot": `${Math.round(r1 * 60 - 30)}deg`,
          width: p.px,
          height: p.px,
          margin: -p.px / 2,
          animationDuration: `${p.ms}ms`,
        } as CSSProperties;
        return (
          <span key={`${burst}-${i}`} className="art-particle" style={style} data-last={i === p.count - 1 ? "" : undefined}>
            <svg viewBox={glyph === "bunga" ? "0 0 100 100" : "0 0 24 24"} width="100%" height="100%" overflow="visible">
              {glyph === "heart" ? (
                <path d={HEART} fill={C.bandung} stroke={C.ink} strokeWidth={2.5} strokeLinejoin="round" />
              ) : glyph === "sparkle" ? (
                <path d={SPARKLE} fill={C.mangga} stroke={C.ink} strokeWidth={2.2} strokeLinejoin="round" />
              ) : (
                <BungaRayaShape sw={8} detail={false} centreR={13} />
              )}
            </svg>
          </span>
        );
      })}
    </span>
  );
}
