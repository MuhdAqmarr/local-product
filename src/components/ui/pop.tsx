import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PopStyleOptions {
  /** Hard-shadow offset in px: buttons 4, chips/icon buttons 2, brand cards 6. */
  offset?: number;
  /** Corner radius of shadow + face in px (default: pill). */
  radius?: number;
  /** Shadow colour (CSS value). Default ink; the ink button uses bandung. */
  color?: string;
}

/** CSS custom properties for a `.pop` root. */
export function popStyle({ offset = 4, radius, color }: PopStyleOptions = {}, extra?: CSSProperties): CSSProperties {
  return {
    ["--pop-offset" as string]: `${offset}px`,
    ...(radius != null ? { ["--pop-radius" as string]: `${radius}px` } : null),
    ...(color ? { ["--pop-color" as string]: color } : null),
    ...extra,
  };
}

export interface PopProps extends PopStyleOptions {
  children: ReactNode;
  className?: string;
  /** Classes for the moving face (fill, padding, height, layout). */
  faceClassName?: string;
  style?: CSSProperties;
}

/**
 * Non-interactive sticker-solid wrapper (the "pop" look on a div, e.g. a brand card or end card).
 * For pressable things use `Button`, `IconButton` or put `className="pop"` on your own link/button
 * and a `<span className="pop-face …">` inside.
 */
export function Pop({ children, className, faceClassName, style, ...opts }: PopProps) {
  return (
    <div className={cn("pop", className)} style={popStyle(opts, style)}>
      <div className={cn("pop-face", faceClassName)}>{children}</div>
    </div>
  );
}
