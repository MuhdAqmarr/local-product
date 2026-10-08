import { getSearchIndex } from "@/lib/catalog";

/** Compact search index the search modal loads on first open. */
export async function GET() {
  return Response.json(await getSearchIndex());
}
