import { cn } from "@/lib/utils";
import { BungaRayaShape } from "./bunga-raya";
import { a11y, C, stroke, type ArtProps } from "./shared";

/**
 * Logo mark: mini bunga raya (Appendix D #1). Sizes: 22 (mobile header), 28 (desktop header), 20 (footer).
 * Rotates 72° (one petal) when its link/button ancestor is hovered or keyboard-focused.
 */
export function LogoMark({ size = 22, className, style, title }: ArtProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn("art-logo-mark", className)}
      style={style}
      {...a11y(title)}
    >
      <BungaRayaShape sw={stroke(5, size, 100, 1)} detail={false} petal={C.bandung} centre={C.mangga} centreR={12} />
    </svg>
  );
}
