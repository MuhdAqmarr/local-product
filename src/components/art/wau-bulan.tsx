import { a11y, C, stroke, type ArtProps } from "./shared";

export interface WauBulanProps extends ArtProps {
  /** Gentle ambient sway (paused offscreen via `[data-ambient]`, off under reduced motion). */
  sway?: boolean;
  /** `cut` = the 404 kite with a snapped string. */
  string?: "long" | "cut";
}

/**
 * Wau bulan, the moon kite that "brings the deals" (Appendix D #5). viewBox 120 × 152.
 * Sizes (width): 140 (desktop hero), 92 (/new header), 48 (Baru rail title), 28 (end of list).
 */
export function WauBulan({ size = 92, sway = true, string = "long", className, style, title }: WauBulanProps) {
  const small = size < 40;
  const sw = stroke(2.5, size, 120, small ? 0.85 : 1);
  const thin = stroke(1.5, size, 120, 0.6);
  return (
    <svg
      viewBox="0 0 120 152"
      width={size}
      height={Math.round((size * 152) / 120)}
      className={className}
      style={style}
      data-ambient={sway ? "" : undefined}
      {...a11y(title)}
    >
      <g stroke={C.ink} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <g
          className={sway ? "ambient" : undefined}
          style={sway ? { transformBox: "fill-box", transformOrigin: "50% 20%", animation: "var(--animate-sway)" } : undefined}
        >
          <path d="M14 34Q60 -6 106 34" fill="none" strokeWidth={stroke(2, size, 120, 0.75)} />
          <path d="M60 28C44 20 20 22 6 42C20 48 42 52 60 58C78 52 100 48 114 42C100 22 76 20 60 28Z" fill={C.keladi} />
          {!small && (
            <path d="M60 34C48 29 33 30 24 39C35 43 48 46 60 50C72 46 85 43 96 39C87 30 72 29 60 34Z" fill={C.innerWing} strokeWidth={thin} />
          )}
          <path d="M60 74C38 74 20 92 16 118C30 104 46 101 60 110C74 101 90 104 104 118C100 92 82 74 60 74Z" fill={C.mangga} />
          {!small && (
            <path d="M60 82C46 83 35 92 31 104C41 98 51 98 60 103C69 98 79 98 89 104C85 92 74 83 60 82Z" fill={C.innerTail} strokeWidth={thin} />
          )}
          <path d="M60 28V112" fill="none" />
          <path d="M60 8L67 18L60 28L53 18Z" fill={C.jambu} />
          <path d="M57 15.5L59 13" stroke={C.white} strokeOpacity={0.7} strokeWidth={Math.max(1.5, sw * 0.7)} />
        </g>
        {string === "cut" ? (
          <path d="M60 112C62 122 66 126 70 128l3 -3l3 3" fill="none" strokeWidth={stroke(2, size, 120, 0.75)} />
        ) : (
          <path
            d="M60 112C62 128 78 134 94 148"
            fill="none"
            strokeWidth={stroke(2, size, 120, 0.9)}
            strokeDasharray={small ? "0.5 9" : "0.5 6"}
          />
        )}
      </g>
    </svg>
  );
}
