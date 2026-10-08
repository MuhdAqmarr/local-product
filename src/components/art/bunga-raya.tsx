import { a11y, C, stroke, type ArtProps } from "./shared";

/** One heart-lobed hibiscus petal pointing up from the centre (viewBox 0 0 100 100). */
export const PETAL = "M50 50C34 46 22 30 30 17C35 9 45 10 50 18C55 10 65 9 70 17C78 30 66 46 50 50Z";
const R = [0, 72, 144, 216, 288] as const;

export interface BungaRayaShapeProps {
  /** Ink stroke in viewBox units. */
  sw: number;
  /** Veins, stamen and pollen. Off for glyph sizes and the logo mark. */
  detail?: boolean;
  petal?: string;
  centre?: string;
  /** Radius of the centre disc. */
  centreR?: number;
}

/** The bare flower as a `<g>` in a 100-unit box, for composing inside other motifs (seal, logo). */
export function BungaRayaShape({ sw, detail = true, petal = C.jambu, centre = C.bandungPekat, centreR = 11 }: BungaRayaShapeProps) {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <g fill={petal} stroke={C.ink} strokeWidth={sw}>
        {R.map((a) => (
          <path key={a} d={PETAL} transform={a ? `rotate(${a} 50 50)` : undefined} />
        ))}
      </g>
      {detail && (
        <g stroke={C.white} strokeWidth={Math.max(2, sw * 0.9)} opacity={0.7}>
          {R.map((a) => (
            <path key={a} d="M50 39V27" transform={a ? `rotate(${a} 50 50)` : undefined} />
          ))}
        </g>
      )}
      <circle cx="50" cy="50" r={centreR} fill={centre} stroke={C.ink} strokeWidth={sw} />
      {detail && (
        <>
          <path d="M50 50L64 27" stroke={C.ink} strokeWidth={sw + 1} />
          <path d="M50 50L64 27" stroke={C.mangga} strokeWidth={Math.max(1.6, sw - 0.6)} />
          <g fill={C.mangga} stroke={C.ink} strokeWidth={Math.max(1, sw / 2)}>
            <circle cx="64.5" cy="26" r="2.6" />
            <circle cx="69" cy="28.5" r="2.1" />
            <circle cx="61" cy="22.5" r="2.1" />
            <circle cx="67.5" cy="22.5" r="1.9" />
          </g>
        </>
      )}
    </g>
  );
}

/**
 * Bunga raya sticker (Appendix D #2). Sizes: 56 (mobile hero), 96 (desktop hero),
 * 40 (seal centre), 10 (ticker separator glyph: outline-free petals, mangga centre).
 */
export function BungaRaya({ size = 56, className, style, title }: ArtProps) {
  const glyph = size < 24;
  const sw = glyph ? 0 : stroke(2, size, 100, 0.9);
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} {...a11y(title)}>
      <BungaRayaShape sw={sw} detail={!glyph} centre={glyph ? C.mangga : C.bandungPekat} centreR={glyph ? 14 : 11} />
    </svg>
  );
}
