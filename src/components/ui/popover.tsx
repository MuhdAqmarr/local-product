import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Native popover helpers (zero JS; Esc and outside click close; top layer). Fade + rise is CSS
 * (`[popover].pop-panel` + @starting-style in globals.css).
 *
 *   <PopoverTrigger target="tier-cili">…</PopoverTrigger>
 *   <PopoverPanel id="tier-cili" placement="below">…</PopoverPanel>
 *
 * Placement: the panel is position-anchored to its trigger where CSS anchor positioning
 * exists (`anchor` = the trigger's anchor name), otherwise it falls back to a centred sheet-like
 * card near the top of the viewport (`fallback`).
 */
export function PopoverTrigger({ target, className, children, ...rest }: { target: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      popoverTarget={target}
      className={className}
      style={{ ["anchorName" as string]: `--${target}` }}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface PopoverPanelProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Accessible name for the panel region. */
  label?: string;
  /** below-start / below-end / below (centred) relative to the trigger. */
  align?: "start" | "end" | "center";
}

export function PopoverPanel({ id, children, className, label, align = "start" }: PopoverPanelProps) {
  return (
    <div
      id={id}
      popover="auto"
      role="dialog"
      aria-label={label}
      data-align={align}
      className={cn("pop-panel anchored-panel rounded-card-lg border-2 border-ink bg-putih p-4 text-ink shadow-float", className)}
      style={{ ["positionAnchor" as string]: `--${id}` }}
    >
      {children}
    </div>
  );
}
