import type { CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bone, plateTint } from "./bone";

/** Shape-exact product card skeleton (§6.12): 2 px garis border, no shadow, tinted 1:1 plate. */
export function ProductCardSkeleton({ i = 0, category, className }: { i?: number; category?: CategorySlug; className?: string }) {
  return (
    <div aria-hidden data-cat={category} className={cn("flex h-full flex-col rounded-card border-2 border-garis bg-putih p-1.5 md:p-2", className)}>
      <span className={cn("skeleton block aspect-square rounded-plate", plateTint(i, category))} style={{ ["--i" as string]: i, ["--skel" as string]: "transparent" }} />
      <div className="flex flex-1 flex-col gap-1 px-1 pb-1 pt-2">
        <div className="flex h-[22px] items-center gap-1.5">
          <Bone i={i} className="size-5 shrink-0" />
          <Bone i={i} className="h-2.5 w-2/5" />
        </div>
        <div className="flex min-h-[2.7em] flex-col justify-center gap-1.5 text-body-sm">
          <Bone i={i} className="h-3 w-[90%]" />
          <Bone i={i} className="h-3 w-[70%]" />
        </div>
        <Bone i={i} className="mt-1 h-4 w-[35%]" />
        <Bone i={i} className="mt-auto h-2.5 w-1/2" />
      </div>
    </div>
  );
}
