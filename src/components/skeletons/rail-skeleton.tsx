import type { CategorySlug } from "@/lib/types";
import { Bone, SkeletonRegion } from "./bone";
import { ProductCardSkeleton } from "./product-card-skeleton";

/** Rail skeleton: header bones + a non-scrolling track of cards at real rail widths. */
export function RailSkeleton({ count = 6, category, header = true, line = false }: { count?: number; category?: CategorySlug; header?: boolean; line?: boolean }) {
  return (
    <SkeletonRegion line={line}>
      {header && (
        <div className="container-page mb-4 flex flex-col gap-2">
          <Bone className="h-7 w-56 max-w-[70%] rounded-[10px]" />
          <Bone className="h-3.5 w-72 max-w-[85%]" />
        </div>
      )}
      <div className="flex gap-3 overflow-hidden px-(--gutter) pb-5 pt-3">
        {Array.from({ length: count }, (_, i) => (
          <ProductCardSkeleton key={i} i={i} category={category} className="w-[clamp(148px,42vw,188px)] shrink-0 lg:w-[216px]" />
        ))}
      </div>
    </SkeletonRegion>
  );
}
