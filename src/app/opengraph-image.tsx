import { OG_ALT, OG_SIZE, ogImage } from "@/components/home/og-card";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = "image/png";

/** Home social card (1200 × 630): Kedai Oyen look with the headline. Static and self-contained. */
export default function OpengraphImage() {
  return ogImage();
}
