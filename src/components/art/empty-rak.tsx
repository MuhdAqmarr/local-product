import { a11y, C, stroke, type ArtProps } from "./shared";

/**
 * Empty kedai shelf for the 404 (Appendix D #12). viewBox 200 × 120, 220 px wide.
 * Oyen (loaf) is placed on the top plank by the caller.
 */
export function EmptyRak({ size = 220, className, style, title }: ArtProps) {
  const sw = stroke(2.5, size, 200, 1);
  return (
    <svg
      viewBox="0 0 200 120"
      width={size}
      height={Math.round((size * 120) / 200)}
      overflow="visible"
      className={className}
      style={style}
      {...a11y(title)}
    >
      <g stroke={C.ink} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M34 52V66L48 52M166 52V66L152 52M34 108V118L46 108M166 108V118L154 108" fill="none" />
        <rect x="10" y="40" width="180" height="12" rx="4" fill={C.plank} />
        <rect x="10" y="96" width="180" height="12" rx="4" fill={C.plank} />
        <path d="M18 44.5H40M18 100.5H34" stroke={C.white} strokeOpacity={0.6} strokeWidth={2} />
      </g>
      <path d="M60 36H90" stroke={C.inkDim} strokeWidth={2} strokeLinecap="round" strokeDasharray="2 5" fill="none" />
    </svg>
  );
}
