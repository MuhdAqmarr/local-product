import { useId } from "react";
import { cn } from "@/lib/utils";
import { BungaRayaShape } from "./bunga-raya";
import { a11y, C, stroke, type ArtProps } from "./shared";

/** 24-scallop rosette, radius 44 ± 5.74 (viewBox 0 0 100 100). */
export const SCALLOP_24 =
  "M50 6A5.74 5.74 0 0 1 61.39 7.5A5.74 5.74 0 0 1 72 11.89A5.74 5.74 0 0 1 81.11 18.89A5.74 5.74 0 0 1 88.11 28A5.74 5.74 0 0 1 92.5 38.61A5.74 5.74 0 0 1 94 50A5.74 5.74 0 0 1 92.5 61.39A5.74 5.74 0 0 1 88.11 72A5.74 5.74 0 0 1 81.11 81.11A5.74 5.74 0 0 1 72 88.11A5.74 5.74 0 0 1 61.39 92.5A5.74 5.74 0 0 1 50 94A5.74 5.74 0 0 1 38.61 92.5A5.74 5.74 0 0 1 28 88.11A5.74 5.74 0 0 1 18.89 81.11A5.74 5.74 0 0 1 11.89 72A5.74 5.74 0 0 1 7.5 61.39A5.74 5.74 0 0 1 6 50A5.74 5.74 0 0 1 7.5 38.61A5.74 5.74 0 0 1 11.89 28A5.74 5.74 0 0 1 18.89 18.89A5.74 5.74 0 0 1 28 11.89A5.74 5.74 0 0 1 38.61 7.5A5.74 5.74 0 0 1 50 6Z";

const RING_TEXT = "100% BUATAN MALAYSIA • SOKONG LOKAL •";

export interface SealProps extends ArtProps {
  /** Slowly rotate the ring text (30 s/turn; /about only). Ambient: paused offscreen, off under reduced motion. */
  spin?: boolean;
}

/**
 * "100% Buatan Malaysia" seal (Appendix D #10): scalloped mangga-tint rosette, ring text,
 * bunga raya centre. Sizes: 96 (desktop hero), 64 (footer, /about).
 */
export function Seal({ size = 64, spin = false, className, style, title }: SealProps) {
  const id = useId();
  const pathId = `seal${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const sw = stroke(2, size, 100, 1);
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={style}
      data-ambient={spin ? "" : undefined}
      {...a11y(title)}
    >
      <path d={SCALLOP_24} fill={C.manggaTint} stroke={C.ink} strokeWidth={sw} strokeLinejoin="round" />
      <circle cx="50" cy="50" r="25" fill="none" stroke={C.ink} strokeWidth={stroke(1.2, size, 100, 0.6)} strokeDasharray="1.5 3" strokeLinecap="round" />
      <path id={pathId} d="M16.52 55.9A34 34 0 1 1 83.48 44.1A34 34 0 1 1 16.52 55.9" fill="none" />
      <g
        className={cn(spin && "ambient")}
        style={spin ? { transformBox: "view-box", transformOrigin: "50px 50px", animation: "var(--animate-spin-slow)" } : undefined}
      >
        <text
          className="font-sans font-semibold"
          fontSize="7.2"
          fill={C.ink}
          dominantBaseline="central"
        >
          <textPath href={`#${pathId}`} textLength="208" lengthAdjust="spacing">
            {RING_TEXT}
          </textPath>
        </text>
      </g>
      <g transform="translate(30 30) scale(.4)">
        <BungaRayaShape sw={stroke(2, size * 0.4, 100, 0.8)} detail={size >= 80} />
      </g>
    </svg>
  );
}
