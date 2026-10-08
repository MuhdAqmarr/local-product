import type { CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCardSkeleton } from "./product-card-skeleton";
import { ProductRowSkeleton } from "./product-row-skeleton";
import { SkeletonRegion } from "./bone";

export interface GridSkeletonProps {
  count?: number;
  category?: CategorySlug;
  /** Desktop layout with the 248 px filter sidebar (4 cols at ≥ 1280 instead of 5). */
  sidebar?: boolean;
  view?: "grid" | "list";
  /** Show the rotating loading line under the grid (default true). */
  line?: boolean;
  className?: string;
}

/** Product grid skeleton: same columns and gaps as ProductGrid (2 / 3 / 4 / 5). Default 8 cards. */
export function GridSkeleton({ count = 8, category, sidebar, view = "grid", line = true, className }: GridSkeletonProps) {
  return (
    <SkeletonRegion line={line} className={className}>
      <div
        className={cn(
          view === "list"
            ? "grid grid-cols-1 gap-2.5 md:grid-cols-2"
            : cn("grid grid-cols-2 gap-x-2.5 gap-y-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4", !sidebar && "xl:grid-cols-5"),
        )}
      >
        {Array.from({ length: count }, (_, i) =>
          view === "list" ? <ProductRowSkeleton key={i} i={i} category={category} /> : <ProductCardSkeleton key={i} i={i} category={category} />,
        )}
      </div>
    </SkeletonRegion>
  );
}
