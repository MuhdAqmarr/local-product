import type { Metadata } from "next";
import { dictionaryFor, getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/site";
import { PageTransition } from "@/components/motion/page-transition";
import { SavedView } from "@/components/saved/saved-view";
import { getStats } from "@/lib/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = dictionaryFor(locale).saved.meta;
  return pageMetadata({
    locale,
    title: t.title,
    description: t.description,
    path: "/saved",
    extra: { robots: { index: false } },
  });
}

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
