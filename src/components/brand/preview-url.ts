/**
 * Brand preview photos in client payloads (QA F03): Shopify file URLs travel without their common
 * prefix and are rebuilt where they render. Plain module, importable from server and client.
 */
const SHOPIFY_FILES = "https://cdn.shopify.com/s/files/";

/** "https://cdn.shopify.com/s/files/1/…" → "1/…"; any other URL is kept whole. */
export function packPreview(url: string): string {
  return url.startsWith(SHOPIFY_FILES) ? url.slice(SHOPIFY_FILES.length) : url;
}

/** Inverse of `packPreview` (full URLs pass through). */
export function unpackPreview(src: string): string {
  return /^(https?:)?\/\//.test(src) || src.startsWith("/") ? src : SHOPIFY_FILES + src;
}
