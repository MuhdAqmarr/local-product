import { cn } from "@/lib/utils";
import { Bone } from "./bone";

/** Kedai card skeleton: static garis awning, 56 px circle, 2 lines, 3 square thumbs, 2 pills. */
export function BrandCardSkeleton({ i = 0, className }: { i?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("flex h-full flex-col overflow-hidden rounded-card-lg border-2 border-garis bg-putih", className)}>
      <div className="relative h-[68px] shrink-0 bg-kapas">
        <div className="awning absolute inset-x-0 top-0" style={{ ["--awning" as string]: "var(--color-garis)", ["--awning-h" as string]: "20px" }} />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 px-4 pb-4">
        <Bone i={i} className="-mt-7 size-14 border-[3px] border-putih" />
        <Bone i={i} className="h-5 w-3/5" />
        <Bone i={i} className="h-3 w-2/5" />
        <div className="flex min-h-[2.7em] flex-col justify-center gap-1.5 text-body-sm">
          <Bone i={i} className="h-3 w-full" />
          <Bone i={i} className="h-3 w-4/5" />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((k) => (
            <Bone key={k} i={i} className="aspect-square rounded-thumb" />
          ))}
        </div>
        <div className="mt-auto flex gap-1.5 pt-0.5">
          <Bone i={i} className="h-6 w-20" />
          <Bone i={i} className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}
