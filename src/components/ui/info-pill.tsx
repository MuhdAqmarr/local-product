import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type InfoPillTone = "promo" | "baru" | "info" | "neutral" | "cat";

const TONE: Record<InfoPillTone, string> = {
  promo: "bg-bandung-tint text-bandung-pekat",
  baru: "bg-pandan-tint text-pandan-pekat",
  info: "bg-keladi-tint text-telang",
  neutral: "bg-kapas text-ink",
  cat: "bg-(--cat-tint) text-(--cat-ink)",
};

/** 24 px tint pill with matching ink text ("12 promo", "4 baru"). `cat` reads the nearest `data-cat`. */
export function InfoPill({ children, tone = "neutral", icon, className }: { children: ReactNode; tone?: InfoPillTone; icon?: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[12px] font-semibold leading-none [&>svg]:size-3.5", TONE[tone], className)}>
      {icon}
      {children}
    </span>
  );
}
