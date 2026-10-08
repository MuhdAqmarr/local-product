import type { CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bone, plateTint } from "./bone";

/** "Senarai" row skeleton: 88 px row, 72 px plate. */
export function ProductRowSkeleton({ i = 0, category, className }: { i?: number; category?: CategorySlug; className?: string }) {
  return (
    <div aria-hidden data-cat={category} className={cn("flex min-h-[88px] items-center gap-3 rounded-card border-2 border-garis bg-putih p-1.5", className)}>
      <span className={cn("skeleton block size-[72px] shrink-0 rounded-thumb", plateTint(i, category))} style={{ ["--i" as string]: i, ["--skel" as string]: "transparent" }} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Bone i={i} className="h-2.5 w-1/3" />
        <Bone i={i} className="h-3 w-[85%]" />
        <Bone i={i} className="h-4 w-1/4" />
      </div>
    </div>
  );
}
