import { Bone, SkeletonRegion } from "@/components/skeletons/bone";
import { PageHead } from "@/components/skeletons/page-head";

export default function Loading() {
  return (
    <>
      <PageHead tone="gula-kapas" title="Semuanya bermula dengan satu soalan." />
      <SkeletonRegion className="container-page mt-8 flex max-w-[720px] flex-col gap-3">
        {[90, 80, 95, 60].map((w, i) => (
          <Bone key={i} i={i} className="h-3.5" style={{ width: `${w}%` }} />
        ))}
      </SkeletonRegion>
    </>
  );
}
