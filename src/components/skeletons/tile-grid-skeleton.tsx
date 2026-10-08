import { Bone, SkeletonRegion } from "./bone";

/** Category rak skeleton: 12 tile bones, 4 × 3 on phones, 6 × 2 on desktop. */
export function TileGridSkeleton({ count = 12, line = true }: { count?: number; line?: boolean }) {
  return (
    <SkeletonRegion line={line}>
      <div className="grid grid-cols-4 gap-x-3 gap-y-6 md:grid-cols-6">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Bone i={i} className="size-16 rounded-tile md:size-20" />
            <Bone i={i} className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}
