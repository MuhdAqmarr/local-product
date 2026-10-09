import { useId } from "react";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/lucide";
import { TierIcon } from "@/components/art/tier-icon";
import { TIER_BY_SLUG } from "@/lib/taxonomy";
import type { TierSlug } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Manglish tier lines (DESIGN §9.10). */
export const TIER_COPY: Record<TierSlug, { line: string; ring: string }> = {
  "cili-padi": { line: "Kecil-kecil cili padi. Home-grown, baru bertatih, tapi pedas!", ring: "KECIL-KECIL CILI PADI •" },
  "naik-daun": { line: "Tengah naik daun. Makin ramai kenal, makin laju jalan.", ring: "TENGAH NAIK DAUN •" },
  ikon: { line: "Nama yang satu Malaysia kenal. Kita membesar sama-sama.", ring: "JENAMA IKON MALAYSIA •" },
};

export interface TierCopProps {
  tier: TierSlug;
  /** `sm` = 24 px `.cop` (lists, cards) · `lg` = 36 px `.cop-lg` gradient sticker (hero, tier cards). */
  size?: "sm" | "lg";
  /** Tap opens a native popover explainer (default). `false` renders a static badge. */
  explain?: boolean;
  className?: string;
}

/**
 * Tier "cop" rubber stamp (DESIGN §5.4, §6.9). Tapping opens a native `popover` with the kawaii
 * icon, tier name, Manglish tagline, criteria and "Kenali tier →". Zero JS: popovertarget + CSS.
 */
export function TierCop({ tier, size = "sm", explain = true, className }: TierCopProps) {
  const id = useId();
  const t = TIER_BY_SLUG[tier];
  const anchor = `--cop${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const face = (
    <>
      <TierIcon tier={tier} size={size === "lg" ? 20 : 14} className="shrink-0" />
      <span className="truncate">{t.name}</span>
    </>
  );
  const copClass = cn("cop", size === "lg" && "cop-lg");

  if (!explain) {
    return (
      <span data-tier={tier} data-tier-trigger="" className={cn(copClass, className)}>
        <span className="sr-only">Tier: </span>
        {face}
      </span>
    );
  }

  const popId = `tier-pop${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <>
      <button
        type="button"
        data-tier={tier}
        data-tier-trigger=""
        popoverTarget={popId}
        aria-label={`Tier: ${t.name}. Apa maksudnya?`}
        className={cn(copClass, "cop-btn", "relative z-10", className)}
        style={{ anchorName: anchor }}
      >
        {face}
      </button>
      <div id={popId} popover="auto" data-tier={tier} className={cn("pop-panel", "cop-panel")} style={{ positionAnchor: anchor }}>
        <div className="flex items-center gap-3">
          <span className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-ink bg-tier">
            <TierIcon tier={tier} size={40} />
          </span>
          <div className="min-w-0">
            <p className="text-overline text-(--tier-ink) uppercase">Saiz jenama</p>
            <p className="text-title-3 text-ink">{t.name}</p>
          </div>
        </div>
        <p className="mt-3 text-body-sm text-ink-2">{TIER_COPY[tier].line}</p>
        <p className="mt-1.5 text-caption text-ink-soft">{t.description}</p>
        <Link
          href="/about#tier"
          className="group mt-3 inline-flex min-h-11 items-center gap-1.5 text-label text-telang underline-offset-4 hover:underline"
        >
          Kenali tier
          <ArrowRight aria-hidden="true" size={16} className="transition-transform duration-200 group-hover:translate-x-[3px]" />
        </Link>
      </div>
    </>
  );
}
