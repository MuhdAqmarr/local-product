import { cn } from "@/lib/utils";
import { a11y, stroke, type ArtProps } from "./shared";

export interface ArrowDoodleProps extends ArtProps {
  /** Mirror horizontally so the arrow points left. */
  flip?: boolean;
}

/**
 * Hand-drawn marker arrow next to Gochi notes (Appendix D #11). viewBox 80 × 36, width 64–80 px.
 * Stroke is `currentColor`, telang by default; recolour with a `text-*` class (e.g. `text-mangga` on ink).
 */
export function ArrowDoodle({ size = 72, flip = false, className, style, title }: ArrowDoodleProps) {
  return (
    <svg
      viewBox="0 0 80 36"
      width={size}
      height={Math.round((size * 36) / 80)}
      overflow="visible"
      className={cn("text-telang", flip && "-scale-x-100", className)}
      style={style}
      {...a11y(title)}
    >
      <path
        d="M4 30C20 10 50 4 76 14M66 6L77 14L66 22"
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke(3, size, 80, 2)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
