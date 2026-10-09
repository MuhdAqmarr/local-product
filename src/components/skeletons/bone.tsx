import type { CSSProperties, ReactNode } from "react";
import type { CategorySlug } from "@/lib/types";
import { LoadingLabel } from "@/components/feedback/loading-label";
import { LoadingLine } from "@/components/feedback/loading-line";
import { cn } from "@/lib/utils";

const CYCLE = ["bg-bandung-tint", "bg-keladi-tint", "bg-mangga-tint"] as const;

/** Plate tint for a skeleton: the category tint when known, else pink / lilac / mango by index. */
export function plateTint(i: number, category?: CategorySlug) {
  return category ? "bg-(--cat-tint)" : CYCLE[i % 3];
}

/**
 * One skeleton block: kapas fill, a single shimmer sweep that starts after 400 ms and travels
 * as a wave in reading order (`i`). Static under reduced motion.
 */
export function Bone({ className, i = 0, style }: { className?: string; i?: number; style?: CSSProperties }) {
  return <span aria-hidden className={cn("skeleton block rounded-full", className)} style={{ ["--i" as string]: i, ...style }} />;
}

/**
 * Wrapper for a loading region: `aria-busy`, one sr-only "Loading…" (page language; override with
 * `label`), and optionally the rotating Gochi loading line under the first group.
 */
export function SkeletonRegion({ children, className, line = true, label }: { children: ReactNode; className?: string; line?: boolean; label?: string }) {
  return (
    <div aria-busy="true" className={className}>
      <span className="sr-only" role="status">
        {label ?? <LoadingLabel />}
      </span>
      {children}
      {line && (
        <div className="mt-6 flex justify-center">
          <LoadingLine />
        </div>
      )}
    </div>
  );
}
