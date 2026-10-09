import { hasLocale, LOCALES } from "@/i18n/config";
import { OG_SIZE, ogAlt, ogImage } from "@/components/home/og-card";

// Static exports can't vary by language; every page sets its own localized alt via pageMetadata().
export const alt = ogAlt("en");
export const size = OG_SIZE;
export const contentType = "image/png";

/** Prerender one card per language. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/** Twitter card: same image as Open Graph (`/twitter-image` · `/ms/twitter-image`). */
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return ogImage(hasLocale(lang) ? lang : "en");
}
