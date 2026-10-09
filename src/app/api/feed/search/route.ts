import { getSearchFeed } from "@/lib/catalog";
import { FEED_CACHE } from "@/components/listing/feed-codec";

/** Compact search index the search modal loads on first open (slim wire format, see feed-codec.ts). */
export async function GET() {
  return Response.json(await getSearchFeed(), { headers: { "Cache-Control": FEED_CACHE } });
}
