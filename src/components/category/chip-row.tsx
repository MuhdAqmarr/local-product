import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ChipRowProps {
  children: ReactNode;
  /** Accessible name for the group ("Kategori", "Tapis pantas"…). */
  label: string;
  /** Wrap instead of scrolling from this breakpoint up (default `lg`); `never` always scrolls. */
  wrapFrom?: "md" | "lg" | "never";
  className?: string;
}

/**
 * Horizontally scrolling chip row with edge fade (DESIGN §6.5): bleeds to the screen edges inside
 * the page gutter, snaps loosely, tells Lenis to leave horizontal swipes alone, wraps on desktop.
 */
export function ChipRow({ children, label, wrapFrom = "lg", className }: ChipRowProps) {
  return (
    <div
      role="group"
      aria-label={label}
      data-lenis-prevent-horizontal=""
      className={cn(
        "no-scrollbar edge-fade -mx-(--gutter) flex snap-x snap-proximity gap-2 overflow-x-auto scroll-px-(--gutter) px-(--gutter) py-2 [--fade:20px] *:snap-start",
        wrapFrom === "lg" && "lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:[mask-image:none] lg:[-webkit-mask-image:none]",
        wrapFrom === "md" && "md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:[mask-image:none] md:[-webkit-mask-image:none]",
        className,
      )}
    >
      {children}
    </div>
  );
}
