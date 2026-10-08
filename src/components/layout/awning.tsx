import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Striped kedai awning (Appendix D #14). `color` = stripe colour (CSS value; default bandung,
 * brands pass `var(--cat-pop)`). Height follows `--awning-h` unless `height` is set.
 * `outlined` adds the ink top line + 2 px ink drop shadow (static filter: allowed here only).
 */
export function Awning({ color, height, outlined = true, className, style }: { color?: string; height?: number; outlined?: boolean; className?: string; style?: CSSProperties }) {
  const vars = {
    ...(color ? { ["--awning" as string]: color } : null),
    ...(height ? { ["--awning-h" as string]: `${height}px` } : null),
    ...style,
  };
  return (
    <div aria-hidden className={cn(outlined && "awning-wrap", "pointer-events-none", className)} style={vars}>
      <div className="awning" />
    </div>
  );
}
