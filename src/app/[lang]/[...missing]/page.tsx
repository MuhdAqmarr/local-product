import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/server";

/**
 * Catch-all for paths no page matches inside a language (`/ms/nope`, and the proxy's rewrite of
 * unknown brand/category slugs to `/{lang}/_lokallah/not-found`). Renders the localized
 * `[lang]/not-found.tsx` inside the root layout with a real 404 status.
 */
export function generateStaticParams() {
  return [{ missing: ["_lokallah", "not-found"] }];
}

/** The localized 404 title ("Empty shelf" / "Rak kosong"); not-found.tsx itself only takes static metadata. */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.errors.notFound.metaTitle, alternates: null };
}

export default function Missing(): never {
  notFound();
}
