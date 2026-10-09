import { getNewFeed } from "@/lib/catalog";
import { FEED_CACHE } from "@/components/listing/feed-codec";

/** Every product launched in the last NEW_WINDOW_DAYS days, newest first, slim wire format. */
export async function GET() {
  return Response.json(await getNewFeed(), { headers: { "Cache-Control": FEED_CACHE } });
}
