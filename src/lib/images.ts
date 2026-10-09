/**
 * Store CDNs that resize on the fly, so we never pay for image optimisation ourselves:
 * - Shopify: `?width=<w>` on cdn.shopify.com or a store's /cdn/shop/ path;
 * - Jetpack Photon (WordPress): `i0`–`i3.wp.com` with `?w=<w>&quality=80`.
 * Any other host is served as-is (callers keep loading="lazy" decoding="async").
 */
export function isShopifyImage(src: string): boolean {
  return /cdn\.shopify\.com|\/cdn\/shop\//.test(src);
}

const PHOTON_HOST = /^i[0-3]\.wp\.com$/;

/** Candidate widths for `srcset`: 96/160 serve the 44–72 px thumbnails at DPR 2–3. */
export const IMAGE_WIDTHS = [96, 160, 240, 360, 480, 640, 800] as const;

function resizable(src: string): URL | null {
  try {
    const url = new URL(src);
    if (isShopifyImage(src) || PHOTON_HOST.test(url.hostname)) return url;
  } catch {
    // Not an absolute URL: leave it alone.
  }
  return null;
}

/** `src` resized to `width` px wide on a resizing CDN; any other URL comes back unchanged. */
export function sizedImage(src: string, width: number): string {
  const url = resizable(src);
  if (!url) return src;
  if (PHOTON_HOST.test(url.hostname)) {
    url.searchParams.delete("fit");
    url.searchParams.delete("resize");
    url.searchParams.set("w", String(width));
    url.searchParams.set("quality", "80");
  } else {
    url.searchParams.set("width", String(width));
  }
  return url.toString();
}

/** `srcset` for a resizing CDN (undefined for other hosts). Pair it with an exact `sizes`. */
export function imageSrcSet(src: string, widths: readonly number[] = IMAGE_WIDTHS): string | undefined {
  if (!resizable(src)) return undefined;
  return widths.map((w) => `${sizedImage(src, w)} ${w}w`).join(", ");
}
