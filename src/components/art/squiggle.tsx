import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { a11y } from "./shared";

export interface SquiggleProps {
  /** `nav` = 3.5 px bandung (active nav, ghost hover); `swash` = 5 px jambu (hero accent word). */
  variant?: "nav" | "swash";
  /** Rendered height in px (8–12). Width is 100 % of the parent by default. */
  height?: number;
  /** Override the colour with a `text-*` class (the stroke is `currentColor`). */
  className?: string;
  style?: CSSProperties;
  title?: string;
}

/**
 * Squiggle underline (Appendix D #7). Stretches to its container width; the stroke stays a
 * constant pixel width (`non-scaling-stroke`) so it is crisp under any word length.
 * Draw-in is the caller's job (e.g. `intro-swash` or a `scaleX` transition).
 */
export function Squiggle({ variant = "nav", height = 10, className, style, title }: SquiggleProps) {
  return (
    <svg
      viewBox="0 0 104 12"
      preserveAspectRatio="none"
      height={height}
      overflow="visible"
      className={cn("block w-full", variant === "swash" ? "text-jambu" : "text-bandung", className)}
      style={style}
      {...a11y(title)}
    >
      <path
        d="M2 8Q12 0 22 8T42 8T62 8T82 8T102 8"
        fill="none"
        stroke="currentColor"
        strokeWidth={variant === "swash" ? 5 : 3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
