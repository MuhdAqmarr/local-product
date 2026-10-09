import { BRAND_OG_ALT, BRAND_OG_SIZE, brandOgImage } from "@/components/brand/brand-og";
import { BRANDS } from "@/lib/brands";

export const alt = BRAND_OG_ALT;
export const size = BRAND_OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.slug }));
}

/** Per-brand social card (QA F10), prerendered for every brand. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return brandOgImage(slug);
}
