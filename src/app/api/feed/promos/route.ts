import { getPromosFeed } from "@/lib/catalog";
import { FEED_CACHE } from "@/components/listing/feed-codec";

/** Every live promo, fairly interleaved across brands, slim wire format. Prerendered and refreshed with the catalog. */
export async function GET() {
  return Response.json(await getPromosFeed(), { headers: { "Cache-Control": FEED_CACHE } });
}
