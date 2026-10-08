import { cn } from "@/lib/utils";
import { Bone } from "./bone";

/** Compact brand row skeleton (< 480 px directory): 88 px, 56 px circle, 3 × 44 px thumbs. */
export function BrandRowSkeleton({ i = 0, className }: { i?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("flex min-h-[88px] items-center gap-3 rounded-card border-2 border-garis bg-putih py-2 pl-2.5 pr-2", className)}>
      <Bone i={i} className="size-14 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Bone i={i} className="h-4 w-3/5" />
        <Bone i={i} className="h-3 w-2/5" />
      </div>
      <div className="hidden w-[144px] shrink-0 grid-cols-3 gap-1 min-[360px]:grid">
        {[0, 1, 2].map((k) => (
          <Bone key={k} i={i} className="aspect-square rounded-[10px]" />
        ))}
      </div>
    </div>
  );
}
