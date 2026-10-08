import { BadgePercent } from "lucide-react";
import { ListingSkeleton } from "@/components/listing/listing-skeleton";
import { PageTransition, SkeletonOut } from "@/components/motion/page-transition";
import { PageHead } from "@/components/skeletons/page-head";
import { Accent } from "@/components/ui/section-header";

export default function Loading() {
  return (
    <PageTransition>
      <PageHead
        tone="mangga-lassi"
        eyebrow={
          <>
            <BadgePercent aria-hidden size={16} /> Harga turun
          </>
        }
        title={
          <>
            Promo <Accent>panas</Accent>
          </>
        }
        sub="Produk tengah promo, terus dari kedai rasmi."
      />
      <SkeletonOut>
        <ListingSkeleton />
      </SkeletonOut>
    </PageTransition>
  );
}
