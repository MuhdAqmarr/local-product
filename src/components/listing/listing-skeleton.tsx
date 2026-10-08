import { Bone } from "@/components/skeletons/bone";
import { GridSkeleton } from "@/components/skeletons/grid-skeleton";

/**
 * Shape-exact loading body for /promos and /new (DESIGN §8.11): filter bar (mobile), sidebar
 * (desktop), toolbar row and 8 card skeletons in the same columns as the real listing.
 */
export function ListingSkeleton() {
  return (
    <div className="mt-3 lg:mt-8">
      <div aria-hidden className="lg:hidden">
        <div className="container-page flex h-(--filterbar-h) items-center gap-2">
          <Bone className="h-9 w-[92px] shrink-0" />
          <Bone i={1} className="h-8 w-[132px] shrink-0" />
          <Bone i={2} className="h-8 min-w-0 flex-1" />
          <Bone i={3} className="size-10 shrink-0" />
        </div>
      </div>
      <div className="container-page lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-8">
        <div aria-hidden className="hidden h-[560px] rounded-card-lg border-2 border-garis bg-putih p-4 lg:flex lg:flex-col lg:gap-4">
          <Bone className="h-6 w-1/3" />
          <Bone i={1} className="h-12 w-full rounded-input" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Bone key={i} i={i + 2} className="h-4" style={{ width: `${82 - (i % 3) * 14}%` }} />
          ))}
        </div>
        <div className="min-w-0">
          <div aria-hidden className="flex items-center justify-between gap-3 pb-3 pt-3 lg:pt-0">
            <Bone className="h-6 w-40" />
            <Bone i={1} className="h-9 w-[104px] sm:w-[216px]" />
          </div>
          <GridSkeleton count={8} sidebar />
        </div>
      </div>
    </div>
  );
}
