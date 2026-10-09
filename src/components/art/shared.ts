import type { CSSProperties } from "react";

/**
 * Hex mirrors of the DESIGN tokens (globals.css `@theme`) used as SVG presentation
 * attributes. Presentation attributes cannot read CSS variables, and plain hex keeps the
 * motifs renderable outside the page CSS (OG images, emails). Themeable parts use
 * `currentColor` or `var(--tier-pop)` via `style` instead.
 */
export const C = {
  ink: "#2B1736",
  white: "#FFFFFF",
  bandung: "#FF6FB5",
  bandungPekat: "#C0136A",
  jambu: "#FF8FC8",
  keladi: "#BDA6FF",
  telang: "#5B2BC9",
  mangga: "#FFD54F",
  manggaTint: "#FFF4C7",
  oyen: "#FFAA55",
  oyenBelang: "#E07020",
  /** Appendix D one-offs (not utility tokens; named for the motif part they paint). */
  muzzle: "#FFF3E6",
  innerWing: "#FFC2DD",
  innerTail: "#A8EED8",
  plank: "#EBCFB5",
  inkDim: "#C9B8D4",
  techTint: "#E2F0FF",
  techMid: "#A4CFFF",
  drinksMid: "#E5C0A1",
  daunPop: "#4CC27A",
} as const;

export interface ArtProps {
  /** Rendered width in CSS px (height follows the motif's aspect ratio). */
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Give the motif an accessible name. Without it the motif is decorative (`aria-hidden`). */
  title?: string;
}

/** Accessibility attributes: decorative by default, `role="img"` + label when titled. */
export function a11y(title?: string) {
  return title
    ? ({ role: "img", "aria-label": title } as const)
    : ({ "aria-hidden": true } as const);
}

/**
 * Stroke width in viewBox units that never renders thinner than `minPx` on screen.
 * `units` is the design stroke at nominal size; `vb` is the viewBox width; `size` the rendered width.
 */
export function stroke(units: number, size: number, vb: number, minPx = 1): number {
  const floor = (minPx * vb) / size;
  return Math.round(Math.max(units, floor) * 100) / 100;
}
