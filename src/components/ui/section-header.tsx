import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** The one accent word of a heading: gradient text that pops in after the header reveals. */
export function Accent({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("accent-word text-grad-lokal", className)}>{children}</span>;
}

/** Mangga highlighter bar behind a phrase (decorative span at 40 % height, not <mark>). */
export function Highlight({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("relative inline-block whitespace-nowrap", className)}>
      <span aria-hidden className="absolute inset-x-[-0.08em] bottom-[0.06em] -z-10 h-[40%] rounded-[4px] bg-mangga" />
      {children}
    </span>
  );
}

export interface SectionHeaderProps {
  title: ReactNode;
  /** Overline above the title ("RAK KATEGORI"). */
  eyebrow?: ReactNode;
  sub?: ReactNode;
  /** Live count next to the link ("38 promo"). */
  meta?: ReactNode;
  href?: string;
  linkLabel?: string;
  /** h2 (default) or h1 for page heads. */
  as?: "h1" | "h2";
  id?: string;
  className?: string;
  /** Extra element on the right (rail controls). */
  aside?: ReactNode;
  /** Disable the RevealObserver fade-up (e.g. above the fold). */
  noReveal?: boolean;
}

/**
 * Section header row (DESIGN §6.11 / §7.5 #1): rises on reveal, accent word pops (+120 ms),
 * "Tengok semua →" fades in (+200 ms). Visible without JS.
 */
export function SectionHeader({ title, eyebrow, sub, meta, href, linkLabel = "Tengok semua", as: H = "h2", id, className, aside, noReveal }: SectionHeaderProps) {
  return (
    <div data-reveal={noReveal ? undefined : ""} className={cn("section-header flex flex-wrap items-end justify-between gap-x-4 gap-y-2", className)}>
      <div className="min-w-0 max-w-[62ch]">
        {eyebrow && <p className="mb-1.5 text-overline uppercase text-ink-soft">{eyebrow}</p>}
        <H id={id} className={H === "h1" ? "text-title-1 text-ink" : "text-title-2 text-ink"}>
          {title}
        </H>
        {sub && <p className="mt-1.5 text-body-sm text-ink-2">{sub}</p>}
      </div>
      {(meta || href || aside) && (
        <div className="flex items-center gap-3" style={{ ["--i" as string]: 3 }}>
          {meta && <span className="text-caption text-ink-soft">{meta}</span>}
          {href && (
            <Link href={href} className="group inline-flex min-h-11 items-center gap-1 text-label text-telang hover:underline hover:decoration-2 hover:underline-offset-4">
              {linkLabel}
              <ArrowRight aria-hidden size={18} className="transition-transform duration-200 ease-out-soft group-hover:translate-x-[3px]" />
            </Link>
          )}
          {aside}
        </div>
      )}
    </div>
  );
}
