import { Bone } from "./bone";

/** Search result row skeleton (48 px plate + two lines). Show 3 while the index loads > 150 ms. */
export function SearchRowSkeleton({ i = 0 }: { i?: number }) {
  return (
    <div aria-hidden className="flex min-h-14 items-center gap-3 px-3 py-2">
      <Bone i={i} className="size-12 shrink-0 rounded-thumb" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Bone i={i} className="h-3 w-3/4" />
        <Bone i={i} className="h-2.5 w-1/3" />
      </div>
      <Bone i={i} className="h-4 w-14" />
    </div>
  );
}
