import { a11y, C, stroke, type ArtProps } from "./shared";

/** Four-point "bintang kecil" (viewBox 0 0 24 24). */
export const SPARKLE = "M12 1Q13.3 10.7 23 12Q13.3 13.3 12 23Q10.7 13.3 1 12Q10.7 10.7 12 1Z";

export interface SparkleProps extends ArtProps {
  /**
   * `candy` = mangga fill + ink outline (hero, explainer, particles).
   * `ink` = plain `currentColor` fill, no outline (inside stickers such as "Baru je").
   */
  tone?: "candy" | "ink";
}

/** Sparkle (Appendix D #4). Sizes: 10 (inside "Baru je"), 16–24 (hero, particles). */
export function Sparkle({ size = 16, tone = "candy", className, style, title }: SparkleProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} {...a11y(title)}>
      {tone === "ink" ? (
        <path d={SPARKLE} fill="currentColor" />
      ) : (
        <path d={SPARKLE} fill={C.mangga} stroke={C.ink} strokeWidth={stroke(1.5, size, 24, 1)} strokeLinejoin="round" />
      )}
    </svg>
  );
}
