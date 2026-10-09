import { BadgePercent } from "@/components/ui/lucide";
import { ListingSkeleton } from "@/components/listing/listing-skeleton";
import { PageTransition, SkeletonOut } from "@/components/motion/page-transition";
import { PageHead } from "@/components/skeletons/page-head";
import { Accent } from "@/components/ui/section-header";
import { rich } from "@/i18n/rich";
import { getDictionary } from "@/i18n/server";

export default async function Loading() {
  const t = (await getDictionary()).listings.promos;
  return (
    <PageTransition>
      <PageHead
        tone="mangga-lassi"
        eyebrow={
          <>
            <BadgePercent aria-hidden size={16} /> {t.eyebrow}
          </>
        }
        title={rich(t.title, { accent: <Accent>{t.titleAccent}</Accent> })}
        sub={t.sub}
      />
      <SkeletonOut>
        <ListingSkeleton />
      </SkeletonOut>
    </PageTransition>
  );
}
