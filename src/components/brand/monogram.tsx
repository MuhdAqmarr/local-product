import { ViewTransition } from "react";
import { TierIcon } from "@/components/art/tier-icon";
import { monogram } from "@/lib/monogram";
import type { CategorySlug, TierSlug } from "@/lib/types";
import { cn } from "@/lib/utils";

export type MonogramSize = 20 | 36 | 56 | 96;

export interface MonogramProps {
  slug: string;
  name: string;
  category: CategorySlug;
  size?: MonogramSize;
  /** ≥ 56 px: a 20 px white badge bottom-right holding the 14 px tier icon. */
  tier?: TierSlug;
  /** Wrap in `<ViewTransition name="brand-av-{slug}" share="morph">`. Only where the brand is unique on the page. */
  morph?: boolean;
  className?: string;
}

/**
 * Brand monogram (DESIGN §5.6): deterministic candy shape + tilt per slug, `--cat-mid` fill,
 * ink outline, glossy highlight, Fredoka initials. Sizes 20 / 36 / 56 / 96.
 * ≥ 56 px is labelled with the brand name; smaller ones are decorative (name sits next to them).
 */
export function Monogram({ slug, name, category, size = 56, tier, morph, className }: MonogramProps) {
  const m = monogram(slug, name);
  const big = size >= 48;
  const strokeW = size < 32 ? 1.5 : 2;
  const fontSize = Array.from(m.initials).length > 1 ? 34 : 44;
  const labelled = size >= 56;

  const art = (
    <span
      data-cat={category}
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size }}
      {...(labelled ? { role: "img", "aria-label": name } : { "aria-hidden": true })}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} overflow="visible" aria-hidden="true" focusable="false" className="block">
        <g transform={`rotate(${m.rotate} 50 50)`}>
          {big && <path d={m.shape} fill="#FFFFFF" stroke="#FFFFFF" strokeWidth={6} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />}
          <path
            d={m.shape}
            style={{ fill: "var(--cat-mid)" }}
            stroke="#2B1736"
            strokeWidth={strokeW}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {size >= 36 && <ellipse cx="32" cy="27" rx="9" ry="5" transform="rotate(-30 32 27)" fill="#FFFFFF" opacity={0.6} />}
          <text
            x="50"
            y="50"
            dy=".35em"
            textAnchor="middle"
            fontSize={fontSize}
            fill="#2B1736"
            className="font-num"
            style={{ fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            {m.initials}
          </text>
        </g>
      </svg>
      {tier && size >= 56 && (
        <span
          className="absolute -right-0.5 -bottom-0.5 grid size-5 place-items-center rounded-full bg-putih shadow-[0_0_0_1.5px_var(--color-ink)]"
          aria-hidden="true"
        >
          <TierIcon tier={tier} size={14} />
        </span>
      )}
    </span>
  );

  if (!morph) return art;
  return (
    <ViewTransition name={`brand-av-${slug}`} share="morph" default="none">
      {art}
    </ViewTransition>
  );
}
