import { OG_ALT, OG_SIZE, ogImage } from "@/components/home/og-card";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = "image/png";

/** Same card as the Open Graph image (summary_large_image). */
export default function TwitterImage() {
  return ogImage();
}
