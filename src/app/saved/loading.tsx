import { GridSkeleton } from "@/components/skeletons/grid-skeleton";
import { PageHead } from "@/components/skeletons/page-head";

export default function Loading() {
  return (
    <>
      <PageHead tone="gula-kapas" title="Simpanan kau" sub="Disimpan dalam phone ni je, tak perlu login." />
      <div className="container-page mt-6">
        <GridSkeleton count={4} />
      </div>
    </>
  );
}
