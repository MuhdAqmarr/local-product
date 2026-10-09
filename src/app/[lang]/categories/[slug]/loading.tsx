import { GridSkeleton } from "@/components/skeletons/grid-skeleton";
import { Bone } from "@/components/skeletons/bone";

export default function Loading() {
  return (
    <>
      <div className="mx-3 mt-3 h-[220px] rounded-[28px] border-2 border-garis bg-kapas md:mx-6 md:mt-5 md:rounded-panel">
        <div className="flex h-full flex-col justify-center gap-3 p-6 md:p-8">
          <Bone className="size-20 rounded-tile bg-putih" />
          <Bone className="h-8 w-56 max-w-[70%] rounded-[10px] bg-putih" />
          <Bone className="h-3.5 w-72 max-w-[85%] bg-putih" />
        </div>
      </div>
      <div className="container-page mt-8">
        <GridSkeleton count={8} />
      </div>
    </>
  );
}
