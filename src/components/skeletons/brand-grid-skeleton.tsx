import { BrandCardSkeleton } from "./brand-card-skeleton";
import { BrandRowSkeleton } from "./brand-row-skeleton";
import { SkeletonRegion } from "./bone";

/** Directory skeleton: rows below 480 px, kedai cards 2 / 3 / 4 columns above. Default 6. */
export function BrandGridSkeleton({ count = 6, line = true }: { count?: number; line?: boolean }) {
  return (
    <SkeletonRegion line={line}>
      <div className="flex flex-col gap-2.5 xs:hidden">
        {Array.from({ length: count }, (_, i) => (
          <BrandRowSkeleton key={i} i={i} />
        ))}
      </div>
      <div className="hidden gap-4 xs:grid xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }, (_, i) => (
          <BrandCardSkeleton key={i} i={i} />
        ))}
      </div>
    </SkeletonRegion>
  );
}
