// Lazy-loaded (import() on the first saves of a session): the teach-once "Masuk Simpan" flight.
// DESIGN §7.6 step 4–5. Rects are measured by the caller before any DOM write.
import { animate } from "motion/react";
import { bump, flightTransition } from "@/lib/motion";

export interface FlightRects {
  from: DOMRect;
  target: HTMLElement;
  to: DOMRect;
}

const HEART_PATH =
  "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z";

/** Plays the catch bump on the Simpan target (tab bar / header heart). WAAPI: no Motion needed. */
export function bumpTarget(target: HTMLElement) {
  const frames = (bump.bump as { scale: number[] }).scale.map((s) => ({ transform: `scale(${s})` }));
  target.animate(frames, { duration: 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
}

/** Flies an 18 px ghost heart from `from` to the visible `[data-saved-target]`, then bumps it. */
export async function flyToSaved({ from, target, to }: FlightRects): Promise<void> {
  const size = 18;
  const ghost = document.createElement("div");
  ghost.setAttribute("aria-hidden", "true");
  ghost.style.cssText = [
    "position:fixed",
    `left:${from.left + from.width / 2 - size / 2}px`,
    `top:${from.top + from.height / 2 - size / 2}px`,
    `width:${size}px`,
    `height:${size}px`,
    "z-index:70",
    "pointer-events:none",
    "will-change:transform",
    "color:var(--color-bandung)",
  ].join(";");
  ghost.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="${HEART_PATH}" fill="currentColor" stroke="#2B1736" stroke-width="2" stroke-linejoin="round"/></svg>`;
  document.body.appendChild(ghost);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  try {
    await animate(ghost, { x: dx, y: dy, scale: 0.6 }, flightTransition);
  } finally {
    ghost.remove();
  }
  bumpTarget(target);
}
