import { useId } from "react";
import { TierIcon } from "@/components/art/tier-icon";
import type { Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { getLocale } from "@/i18n/server";
import { commonFor } from "@/i18n/shared";
import { tierCopy } from "@/lib/taxonomy";
import type { TierSlug } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface TierStampProps {
  tier: TierSlug;
  /** Default 112 px (brand profile hero). */
  size?: number;
  /** Ambient ring rotation (30 s / turn, paused offscreen via `data-ambient`). */
  spin?: boolean;
  className?: string;
}

/**
 * 112 px rubber tier stamp (DESIGN §5.4 / Appendix D #13): tier-tint disc, 3 px ink ring,
 * dashed inner ring, Fredoka caps ring text on a circle path, kawaii icon in the centre.
 * Only the ring turns. Labelled "Tier: {name}"; ring text in the page language. Server Components only.
 */
export async function TierStamp(props: TierStampProps) {
  return <TierStampView {...props} locale={await getLocale()} />;
}

function TierStampView({ tier, size = 112, spin = true, className, locale }: TierStampProps & { locale: Locale }) {
  const pathId = `stamp${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const t = tierCopy(tier, locale);
  return (
    <span
      data-tier={tier}
      data-tier-trigger=""
      data-ambient=""
      role="img"
      aria-label={fmt(commonFor(locale).tier.sr, { name: t.name })}
      className={cn("relative inline-grid shrink-0 place-items-center drop-shadow-[0_3px_0_rgb(43_23_54_/_0.14)]", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 112 112" width={size} height={size} aria-hidden="true" focusable="false" className="absolute inset-0">
        <circle cx="56" cy="56" r="53" fill="#FFFFFF" />
        <circle cx="56" cy="56" r="50" style={{ fill: "var(--tier-tint)" }} stroke="#2B1736" strokeWidth={3} />
        <circle cx="56" cy="56" r="31" fill="none" stroke="#2B1736" strokeWidth={1.5} strokeDasharray="4 5" />
        <g className={cn(spin && "ambient", spin && "stamp-ring")}>
          <path id={pathId} d="M56 56m-40 0a40 40 0 1 1 80 0a40 40 0 1 1 -80 0" fill="none" />
          <text className="font-num" fontSize={11} fill="#2B1736" style={{ fontWeight: 600, letterSpacing: "0.08em" }}>
            <textPath href={`#${pathId}`} textLength={248} lengthAdjust="spacing">
              {t.ring}
            </textPath>
          </text>
        </g>
      </svg>
      <TierIcon tier={tier} size={Math.round(size * 0.36)} className="relative" />
    </span>
  );
}
