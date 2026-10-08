import { Sparkles } from "lucide-react";
import { ListingSkeleton } from "@/components/listing/listing-skeleton";
import { PageTransition, SkeletonOut } from "@/components/motion/page-transition";
import { PageHead } from "@/components/skeletons/page-head";
import { Accent } from "@/components/ui/section-header";

export default function Loading() {
  return (
    <PageTransition>
      <PageHead
        tone="cendol"
        eyebrow={
          <>
            <Sparkles aria-hidden size={16} /> Launch baru
          </>
        }
        title={
          <>
            Baru <Accent>sampai</Accent>
          </>
        }
        sub="Produk yang baru launch kat kedai rasmi jenama lokal."
      />
      <SkeletonOut>
        <ListingSkeleton />
      </SkeletonOut>
    </PageTransition>
  );
}
