import { GridSkeleton } from "@/components/skeletons/grid-skeleton";
import { PageHead } from "@/components/skeletons/page-head";
import { getDictionary } from "@/i18n/server";

export default async function Loading() {
  const t = (await getDictionary()).saved;
  return (
    <>
      <PageHead tone="gula-kapas" title={t.title} sub={t.sub} />
      <div className="container-page mt-6">
        <GridSkeleton count={4} />
      </div>
    </>
  );
}
