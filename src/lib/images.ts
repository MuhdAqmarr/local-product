/** Shopify's CDN resizes on the fly via ?width=, so we never pay for image optimisation ourselves. */
export function isShopifyImage(src: string): boolean {
  return /cdn\.shopify\.com|\/cdn\/shop\//.test(src);
}

export function sizedImage(src: string, width: number): string {
  if (!isShopifyImage(src)) return src;
  try {
    const url = new URL(src);
    url.searchParams.set("width", String(width));
    return url.toString();
  } catch {
    return src;
  }
}

export function imageSrcSet(src: string, widths: readonly number[] = [240, 360, 480, 640, 800]): string | undefined {
  if (!isShopifyImage(src)) return undefined;
  return widths.map((w) => `${sizedImage(src, w)} ${w}w`).join(", ");
}
