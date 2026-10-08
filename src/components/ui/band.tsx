import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BandTone = "gula-kapas" | "bandung-fizz" | "mangga-lassi" | "cendol" | "senja" | "teh-tarik" | "putih";

const TONE: Record<BandTone, string> = {
  "gula-kapas": "bg-gula-kapas",
  "bandung-fizz": "bg-bandung-fizz",
  "mangga-lassi": "bg-mangga-lassi",
  cendol: "bg-cendol",
  senja: "bg-senja",
  "teh-tarik": "bg-teh-tarik",
  putih: "bg-putih",
};

/**
 * Gradient band panel (DESIGN §6.1): the only big ink-outlined surfaces.
 * `mx-3 md:mx-6 rounded-[28px] md:rounded-panel p-4 md:p-8 border-2 border-ink shadow-pop-lg`.
 * Text on bands is ink / ink-2 only.
 */
export function Band({
  tone = "gula-kapas",
  children,
  className,
  as: Tag = "section",
  id,
  labelledBy,
}: {
  tone?: BandTone;
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "header";
  id?: string;
  labelledBy?: string;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative isolate mx-3 overflow-hidden rounded-sheet border-2 border-ink p-4 shadow-pop-lg md:mx-6 md:rounded-panel md:p-8", TONE[tone], className)}
    >
      {children}
    </Tag>
  );
}
