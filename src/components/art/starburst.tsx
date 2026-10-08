import { a11y, C, stroke, type ArtProps } from "./shared";

/** 16-point kad harga burst, outer radius 50, inner 42 (viewBox 0 0 100 100). */
export const BURST_16 =
  "M50 0L58.2 8.8L69.1 3.8L73.3 15.1L85.4 14.6L84.9 26.7L96.2 30.9L91.2 41.8L100 50L91.2 58.2L96.2 69.1L84.9 73.3L85.4 85.4L73.3 84.9L69.1 96.2L58.2 91.2L50 100L41.8 91.2L30.9 96.2L26.7 84.9L14.6 85.4L15.1 73.3L3.8 69.1L8.8 58.2L0 50L8.8 41.8L3.8 30.9L15.1 26.7L14.6 14.6L26.7 15.1L30.9 3.8L41.8 8.8Z";

/**
 * Kad harga starburst (Appendix D #3), the Deal L3 sticker shape: mangga fill, white die-cut, ink outline.
 * Sizes: 56 (cards), 64 (brand best deal, hero), 40 (search/list mini). The "−45%" label is HTML
 * layered on top by the caller (Fredoka 600, ink), never SVG text.
 */
export function Starburst({ size = 56, className, style, title }: ArtProps) {
  const ink = stroke(4, size, 112, 1.25);
  return (
    <svg viewBox="-6 -6 112 112" width={size} height={size} className={className} style={style} {...a11y(title)}>
      <g strokeLinejoin="round">
        <path d={BURST_16} fill={C.white} stroke={C.white} strokeWidth={10} />
        <path d={BURST_16} fill={C.mangga} stroke={C.ink} strokeWidth={ink} />
      </g>
    </svg>
  );
}
