import { Store } from "@/components/ui/lucide";
import { PageTransition, SkeletonOut } from "@/components/motion/page-transition";
import { BrandGridSkeleton } from "@/components/skeletons/brand-grid-skeleton";
import { Bone } from "@/components/skeletons/bone";
import { PageHead } from "@/components/skeletons/page-head";
import { rich } from "@/i18n/rich";
import { getDictionary } from "@/i18n/server";

/** /brands loading (DESIGN §8.11): real head, filter shapes, 6 brand skeletons. */
export default async function Loading() {
  const t = (await getDictionary()).brands.directory;
  return (
    <PageTransition>
      <PageHead
        tone="bandung-fizz"
        eyebrow={
          <>
            <Store aria-hidden size={16} /> {t.eyebrow}
          </>
        }
        title={rich(t.title, { accent: <span className="text-grad-lokal">{t.titleAccent}</span> })}
        sub={t.subLoading}
      />
      <SkeletonOut>
        <div className="container-page pb-(--section-y)" aria-hidden>
          <div className="mt-4 flex gap-2.5 py-2.5 lg:hidden">
            <Bone className="h-12 flex-1" />
            <Bone className="h-12 w-28" />
          </div>
          <div className="flex gap-2 overflow-hidden py-2 lg:hidden">
            {Array.from({ length: 4 }, (_, i) => (
              <Bone key={i} i={i} className="h-10 w-28 shrink-0" />
            ))}
          </div>
          <div className="mt-6 hidden h-[188px] rounded-card-lg border-2 border-garis bg-putih p-5 lg:block">
            <div className="flex gap-4">
              <Bone className="h-12 flex-1" />
              <Bone className="h-11 w-[480px]" />
            </div>
            <div className="mt-5 flex gap-2">
              {Array.from({ length: 8 }, (_, i) => (
                <Bone key={i} i={i} className="h-10 w-28" />
              ))}
            </div>
          </div>
          <Bone className="mt-4 h-5 w-48 lg:mt-6" />
          <div className="mt-4">
            <BrandGridSkeleton count={6} />
          </div>
        </div>
      </SkeletonOut>
    </PageTransition>
  );
}
