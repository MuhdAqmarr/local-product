import type { TierSlug } from "@/lib/types";
import { cn } from "@/lib/utils";
import { a11y, C, stroke, type ArtProps } from "./shared";

export interface TierIconProps extends ArtProps {
  tier: TierSlug;
  /** Force the kawaii face on/off. Default: on at ≥ 28 px, off below. */
  face?: boolean;
}

const BODY = { fill: "var(--tier-pop)" } as const;

/**
 * Kawaii tier icons (Appendix D #6): chili seed → sprouting leaf → crown. viewBox 48.
 * Sizes: 14 (cop, faces dropped), 20 (cop-lg), 40 (stamp, popover), 96 (tier journey).
 * Strokes are identical from 28 px up, so one instance can serve every breakpoint: pass the
 * smallest size and grow it with classes (`size={40} className="lg:size-24"`), never two copies.
 *
 * The main body is painted with `var(--tier-pop)` (the svg carries its own `data-tier`).
 * Micro-animation (§7.5 #6) plays on hover of the icon, or when an ancestor marked
 * `data-tier-trigger` is hovered, focus-visible, or gets `data-active="true"`.
 */
export function TierIcon({ tier, size = 20, face, className, style, title }: TierIconProps) {
  const showFace = face ?? size >= 28;
  const sw = stroke(2, size, 48, size < 28 ? 1.05 : 1);
  const fine = stroke(1.4, size, 48, 0.75);
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      data-tier={tier}
      className={cn("art-tier", className)}
      style={style}
      {...a11y(title)}
    >
      {tier === "cili-padi" ? (
        <g className="art-cili" strokeLinecap="round" strokeLinejoin="round">
          <g stroke={C.ink} strokeWidth={sw}>
            <path d="M24 12C25 7 28 5 32 4" fill="none" strokeWidth={sw * 1.25} />
            <path d="M18 15C14 24 12 34 7 44C18 41 27 30 31 16C27 12 22 12 18 15Z" style={BODY} />
            <path d="M16 16C20 10 28 10 32 16C28 18 20 18 16 16Z" fill={C.daunPop} />
          </g>
          {showFace && (
            <>
              <path d="M28 18.5C28.4 19.8 28.4 21 28.1 22.3" fill="none" stroke={C.white} strokeOpacity={0.7} strokeWidth={2} />
              <g>
                <circle cx="19.5" cy="25" r="1.6" fill={C.ink} />
                <circle cx="25.2" cy="25.5" r="1.6" fill={C.ink} />
                <path d="M21 29Q22.6 30.6 24.2 29" fill="none" stroke={C.ink} strokeWidth={fine} />
              </g>
            </>
          )}
        </g>
      ) : tier === "naik-daun" ? (
        <g className="art-daun" strokeLinecap="round" strokeLinejoin="round">
          <g stroke={C.ink} strokeWidth={sw}>
            <ellipse cx="24" cy="41" rx="13" ry="4.5" fill={C.drinksMid} />
            <path d="M24 40V20" fill="none" strokeWidth={sw * 1.25} />
            <path d="M24 27C16 29 8 23 8 14C16 12 23 17 24 27Z" style={BODY} />
            <path d="M24 21C25 12 33 6 42 8C42 18 33 23 24 21Z" style={BODY} />
          </g>
          {showFace && (
            <g>
              <circle cx="31.5" cy="14.5" r="1.4" fill={C.ink} />
              <circle cx="36" cy="13.2" r="1.4" fill={C.ink} />
              <path d="M33 17.3Q34.3 18.4 35.6 17" fill="none" stroke={C.ink} strokeWidth={stroke(1.2, size, 48, 0.75)} />
            </g>
          )}
        </g>
      ) : (
        <g className="art-ikon" strokeLinejoin="round" strokeLinecap="round">
          <g stroke={C.ink} strokeWidth={sw}>
            <path d="M9 33L6 14L16 22L24 8L32 22L42 14L39 33Z" style={BODY} />
            <rect x="8" y="32" width="32" height="8" rx="3" style={BODY} />
            <circle className="art-jewel" cx="6" cy="13" r="3" fill={C.jambu} />
            <circle className="art-jewel" cx="24" cy="7" r="3" fill={C.techMid} />
            <circle className="art-jewel" cx="42" cy="13" r="3" fill={C.jambu} />
          </g>
          {showFace && (
            <>
              <circle cx="20" cy="26" r="1.5" fill={C.ink} />
              <circle cx="28" cy="26" r="1.5" fill={C.ink} />
              <path d="M22.5 29Q24 30.4 25.5 29" fill="none" stroke={C.ink} strokeWidth={stroke(1.3, size, 48, 0.75)} />
              <path d="M12 36H17" stroke={C.white} strokeOpacity={0.7} strokeWidth={2} />
            </>
          )}
        </g>
      )}
    </svg>
  );
}
