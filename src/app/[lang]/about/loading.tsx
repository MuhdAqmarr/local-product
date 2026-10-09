import { Bone, SkeletonRegion } from "@/components/skeletons/bone";
import { PageHead } from "@/components/skeletons/page-head";
import { fmt } from "@/i18n/format";
import { getDictionary } from "@/i18n/server";

export default async function Loading() {
  const t = (await getDictionary()).about.hero;
  return (
    <>
      <PageHead tone="gula-kapas" title={fmt(t.title, { accent: t.accent })} />
      <SkeletonRegion className="container-page mt-8 flex max-w-[720px] flex-col gap-3">
        {[90, 80, 95, 60].map((w, i) => (
          <Bone key={i} i={i} className="h-3.5" style={{ width: `${w}%` }} />
        ))}
      </SkeletonRegion>
    </>
  );
}
