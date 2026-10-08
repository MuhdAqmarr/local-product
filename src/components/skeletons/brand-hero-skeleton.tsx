import type { CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bone, SkeletonRegion } from "./bone";
import { ProductCardSkeleton } from "./product-card-skeleton";

/**
 * /brands/[slug] loading (§8.11): cover in the category tint when known (else kapas), real awning,
 * monogram circle, 2 text bones, button-row bones, tab track, 6 cards.
 */
export function BrandHeroSkeleton({ category }: { category?: CategorySlug }) {
  return (
    <SkeletonRegion line={false}>
      <div data-cat={category}>
        <div className={cn("relative h-40 overflow-hidden lg:h-[220px]", category ? "bg-cover-cat" : "bg-kapas")}>
          <div className="awning-wrap absolute inset-x-0 top-0 border-t-0">
            <div className="awning" style={{ ["--awning" as string]: category ? "var(--cat-pop)" : "var(--color-garis)", ["--awning-h" as string]: "22px" }} />
          </div>
        </div>
        <div className="container-page">
          <div className="relative -mt-12 rounded-card-lg border-2 border-garis bg-putih p-5 md:p-6">
            <Bone className="-mt-14 size-24 border-4 border-putih" />
            <Bone className="mt-4 h-8 w-3/5 rounded-[10px]" />
            <Bone className="mt-3 h-3.5 w-2/5" />
            <div className="mt-4 flex flex-col gap-2">
              <Bone className="h-3 w-full max-w-[60ch]" />
              <Bone className="h-3 w-4/5 max-w-[48ch]" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Bone className="h-12 w-full sm:w-56" />
              <Bone className="h-10 w-28" />
              <Bone className="h-10 w-24" />
            </div>
          </div>
          <Bone className="mt-6 h-11 w-full max-w-[420px]" />
          <div className="mt-5 grid grid-cols-2 gap-x-2.5 gap-y-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {Array.from({ length: 6 }, (_, i) => (
              <ProductCardSkeleton key={i} i={i} category={category} />
            ))}
          </div>
        </div>
      </div>
    </SkeletonRegion>
  );
}
