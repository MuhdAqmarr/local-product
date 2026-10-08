import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { SavedView } from "@/components/saved/saved-view";
import { getStats } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Simpanan kau",
  description: "Produk dan jenama yang kau simpan, dengan semakan harga terkini.",
  robots: { index: false },
};

/**
 * /saved (DESIGN §8.7). The list lives in this browser only, so the page is a static shell and
 * `SavedView` renders skeletons until it has read localStorage after mount.
 */
export default async function SavedPage() {
  const { syncedAt } = await getStats();
  return (
    <PageTransition>
      <SavedView syncedAt={syncedAt} />
    </PageTransition>
  );
}
