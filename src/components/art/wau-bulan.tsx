import { a11y, C, stroke, type ArtProps } from "./shared";

export interface WauBulanProps extends ArtProps {
  /** Gentle ambient sway (paused offscreen via `[data-ambient]`, off under reduced motion). */
  sway?: boolean;
  /** `cut` = the 404 kite with a snapped string. */
  string?: "long" | "cut";
}

/**
 * Wau bulan, the moon kite that "brings the deals" (Appendix D #5). viewBox 120 × 152: kepala + busur,
 * gull wings with up-curled tips and rumbai, pinched waist, crescent-moon tail (horns up), string from the waist.
 * Sizes (width): 140 (desktop hero), 92 (/new header), 48 (Baru rail title), 28 (end of list).
 * Strokes are identical from 40 px up, so one instance can serve every breakpoint: pass the
 * smallest size and grow it with classes (`size={76} className="h-auto w-[76px] md:w-[124px]"`).
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
        {/* Tali (string) first so it tucks under the tail and leaves the kite from the waist. */}
        {string === "cut" ? (
          <path d="M60 72C61 100 64 120 70 132l3 -3l3 3" fill="none" strokeWidth={stroke(2, size, 120, 0.75)} />
        ) : (
          <path
            d="M60 72C64 106 78 132 94 148"
            fill="none"
            strokeWidth={stroke(2, size, 120, 0.9)}
            strokeDasharray={small ? "0.5 9" : "0.5 6"}
          />
        )}
        <g
          className={sway ? "ambient" : undefined}
          style={sway ? { transformBox: "fill-box", transformOrigin: "50% 20%", animation: "var(--animate-sway)" } : undefined}
        >
          <path d="M30 30Q60 -24 90 30" fill="none" strokeWidth={stroke(2, size, 120, 0.75)} />
          <path
            d="M60 26C46 30 30 31 18 24C12 20 8 14 6 8C4 22 12 36 28 42C42 47 54 50 60 58C66 50 78 47 92 42C108 36 116 22 114 8C112 14 108 20 102 24C90 31 74 30 60 26Z"
            fill={C.keladi}
          />
          {!small && (
            <path
              d="M60 32C48 35 34 36 22 31C24 36 30 40 38 42C46 44 54 47 60 51C66 47 74 44 82 42C90 40 96 36 98 31C86 36 72 35 60 32Z"
              fill={C.innerWing}
              strokeWidth={thin}
            />
          )}
          <path d="M60 114C30 114 6 94 2 56C14 80 36 92 60 88C84 92 106 80 118 56C114 94 90 114 60 114Z" fill={C.mangga} />
          {!small && (
            <path d="M60 108C40 108 22 98 13 78C26 92 42 98 60 96C78 98 94 92 107 78C98 98 80 108 60 108Z" fill={C.innerTail} strokeWidth={thin} />
          )}
          <path d="M60 26V89" fill="none" />
          {!small && <path d="M6 9l-3 8M6 9l3 7M114 9l3 8M114 9l-3 7" fill="none" stroke={C.bandung} strokeWidth={stroke(2, size, 120, 0.75)} />}
          <path d="M60 6L67 15L60 25L53 15Z" fill={C.jambu} />
          <path d="M57 13.5L59 11" stroke={C.white} strokeOpacity={0.7} strokeWidth={Math.max(1.5, sw * 0.7)} />
        </g>
      </g>
    </svg>
  );
}
