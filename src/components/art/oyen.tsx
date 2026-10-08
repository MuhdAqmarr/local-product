import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { a11y, C, stroke, type ArtProps } from "./shared";

export type OyenMood = "idle" | "cari" | "happy" | "tidur" | "terkejut";
export type OyenPose = "head" | "loaf" | "peek";

export interface OyenProps extends ArtProps {
  /**
   * `idle` open eyes, blinks (hero peek, search empty) · `cari` looking through a magnifier
   * (no results) · `happy` ^ ^ eyes + blush (success) · `tidur` asleep with floating z's
   * (empty shelves, 404, footer) · `terkejut` round eyes, "o" mouth (error, offline).
   */
  mood?: OyenMood;
  /** `head` (default), `loaf` (sitting on a plank), `peek` (head + paws over an edge; the caller clips the bottom). */
  pose?: OyenPose;
  /** Disable the ambient loops (blink, z's), e.g. inside a toast. */
  still?: boolean;
}

const BLINK: CSSProperties = { transformBox: "fill-box", transformOrigin: "center", animation: "var(--animate-blink)" };
const ZZZ: CSSProperties = { transformBox: "fill-box", transformOrigin: "center", animation: "var(--animate-zzz)" };

/**
 * Oyen the tauke (Appendix D #9), the ginger kedai cat. viewBox 160.
 * Sizes: 64 (search), 96 (footer loaf), 120 (empty states), 140 max on mobile.
 * Always decorative unless titled; whatever he "says" must also exist as real text.
 * The tidur z's use `currentColor` (telang by default); on ink pass e.g. `className="text-jambu"`.
 */
export function Oyen({ mood = "idle", pose = "head", still = false, size = 120, className, style, title }: OyenProps) {
  const sw = stroke(3, size, 160, 1);
  const fine = stroke(2, size, 160, 0.75);
  const blinks = !still && (mood === "idle" || mood === "cari" || mood === "terkejut");
  const snores = !still && mood === "tidur";
  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      overflow="visible"
      className={cn("text-telang", className)}
      style={style}
      data-ambient={blinks || snores ? "" : undefined}
      {...a11y(title)}
    >
      <g stroke={C.ink} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        {pose === "loaf" && (
          <>
            <path d="M124 138C146 140 154 120 142 108" fill="none" strokeWidth={sw + 11} />
            <path d="M124 138C146 140 154 120 142 108" fill="none" stroke={C.oyen} strokeWidth={11} />
            <path d="M147 125.5L139.5 121M150 115L142 113.5" fill="none" stroke={C.oyenBelang} strokeWidth={4} />
            <path d="M34 122C34 106 52 98 80 98C108 98 126 106 126 122V138C126 146 120 150 112 150H48C40 150 34 146 34 138Z" fill={C.oyen} />
            <g stroke={C.oyenBelang} strokeWidth={4.5}>
              <path d="M38 126H46M37.5 136H44M122 126H114M122.5 136H116" />
            </g>
            <path d="M60 150C60 144 70 142 72 148M88 148C90 142 100 144 100 150" fill={C.oyen} strokeWidth={fine} />
          </>
        )}

        {/* ears: soft tips, pink insides tucked under the head */}
        <path d="M42 60L35.5 24Q34 15 42 19L72 38Z" fill={C.oyen} />
        <path d="M118 60L124.5 24Q126 15 118 19L88 38Z" fill={C.oyen} />
        <path d="M45 50L41.5 29.5L61 41Z" fill={C.bandung} stroke="none" />
        <path d="M115 50L118.5 29.5L99 41Z" fill={C.bandung} stroke="none" />

        <path d="M28 78C28 48 52 33 80 33C108 33 132 48 132 78C132 108 110 123 80 123C50 123 28 108 28 78Z" fill={C.oyen} />

        <g stroke={C.oyenBelang} strokeWidth={4.5}>
          <path d="M70 39L72 50M80 36V49M90 39L88 50M30 72H40M130 72H120M31 82H38M129 82H122" />
        </g>
        <path d="M46 53Q51 48.5 57 46.5" fill="none" stroke={C.white} strokeOpacity={0.6} strokeWidth={4} />

        {/* muzzle + blush */}
        <path d="M80 89C74 85 62 86 62 97C62 106 72 109 80 105C88 109 98 106 98 97C98 86 86 85 80 89Z" fill={C.muzzle} stroke="none" />
        <g fill={C.bandung} stroke="none" opacity={mood === "happy" ? 0.75 : 0.5}>
          <ellipse cx="48" cy="93" rx="8.5" ry="5" />
          <ellipse cx="112" cy="93" rx="8.5" ry="5" />
        </g>

        <Eyes mood={mood} sw={sw} animate={blinks} />

        {/* nose + mouth */}
        <path d="M75.5 88H84.5L80 93.5Z" fill={C.bandung} strokeWidth={fine} />
        <Mouth mood={mood} sw={stroke(2.5, size, 160, 0.9)} />

        <g strokeWidth={fine} fill="none">
          <path d="M20 88L37 90M22 99L37 96M140 88L123 90M138 99L123 96" />
        </g>

        {pose === "peek" && (
          <g fill={C.oyen}>
            <ellipse cx="58" cy="126" rx="13" ry="9" />
            <ellipse cx="102" cy="126" rx="13" ry="9" />
            <path d="M54 119.5V124M62 119.5V124M98 119.5V124M106 119.5V124" fill="none" strokeWidth={fine} />
          </g>
        )}

        {mood === "cari" && (
          <g>
            <path d="M138 128L150 140" fill="none" strokeWidth={sw + 7} />
            <path d="M138.5 128.5L149 139" fill="none" stroke={C.keladi} strokeWidth={5} />
            <circle cx="126" cy="116" r="15" fill={C.techTint} fillOpacity={0.85} />
            <path d="M117 110Q120 105 126 104" fill="none" stroke={C.white} strokeWidth={3.5} />
          </g>
        )}
      </g>

      {mood === "terkejut" && (
        <path d="M126 40C129 45 131 48 131 51A5 5 0 0 1 121 51C121 48 123 45 126 40Z" fill={C.techMid} stroke={C.ink} strokeWidth={fine} strokeLinejoin="round" />
      )}

      {mood === "tidur" && (
        <g className="font-num" fill="currentColor" stroke="none">
          <text x="132" y="52" fontSize="22" className={snores ? "ambient" : undefined} style={snores ? ZZZ : undefined}>
            z
          </text>
          <text
            x="147"
            y="32"
            fontSize="16"
            className={snores ? "ambient" : undefined}
            style={snores ? { ...ZZZ, animationDelay: "1.2s" } : undefined}
          >
            z
          </text>
        </g>
      )}
    </svg>
  );
}

function Eyes({ mood, sw, animate }: { mood: OyenMood; sw: number; animate: boolean }) {
  if (mood === "happy") {
    return <path d="M53 81Q61 70 69 81M91 81Q99 70 107 81" fill="none" strokeWidth={sw + 0.5} />;
  }
  if (mood === "tidur") {
    return <path d="M53 78Q61 85 69 78M91 78Q99 85 107 78" fill="none" strokeWidth={sw + 0.5} />;
  }
  const g = animate ? { className: "ambient", style: BLINK } : {};
  if (mood === "terkejut") {
    return (
      <g {...g}>
        <circle cx="61" cy="77" r="9" fill={C.white} />
        <circle cx="99" cy="77" r="9" fill={C.white} />
        <circle cx="61" cy="77" r="3.8" fill={C.ink} stroke="none" />
        <circle cx="99" cy="77" r="3.8" fill={C.ink} stroke="none" />
      </g>
    );
  }
  const dx = mood === "cari" ? 3 : 0;
  return (
    <g {...g} stroke="none">
      <ellipse cx={61 + dx} cy="78" rx="7" ry="8.5" fill={C.ink} />
      <ellipse cx={99 + dx} cy="78" rx="7" ry="8.5" fill={C.ink} />
      <circle cx={63.4 + dx} cy="74.5" r="2.6" fill={C.white} />
      <circle cx={101.4 + dx} cy="74.5" r="2.6" fill={C.white} />
      <circle cx={58.8 + dx} cy="81.5" r="1.2" fill={C.white} />
      <circle cx={96.8 + dx} cy="81.5" r="1.2" fill={C.white} />
    </g>
  );
}

function Mouth({ mood, sw }: { mood: OyenMood; sw: number }) {
  if (mood === "terkejut") return <ellipse cx="80" cy="101" rx="4" ry="5" fill={C.ink} strokeWidth={sw * 0.6} />;
  if (mood === "happy") {
    return (
      <g strokeWidth={sw}>
        <path d="M71 96Q80 112 89 96Q84.5 98.5 80 95.5Q75.5 98.5 71 96Z" fill={C.ink} />
        <path d="M75.5 102.5Q80 99 84.5 102.5Q80 106.5 75.5 102.5Z" fill={C.bandung} stroke="none" />
      </g>
    );
  }
  const small = mood === "tidur";
  return (
    <path
      d={small ? "M75 96Q77.5 99 80 96Q82.5 99 85 96" : "M72 95Q76 100.5 80 95Q84 100.5 88 95"}
      fill="none"
      strokeWidth={sw}
    />
  );
}
