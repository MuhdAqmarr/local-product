import { getPromos } from "@/lib/catalog";

/** Every live promo, fairly interleaved across brands. Prerendered and refreshed with the catalog. */
export async function GET() {
  return Response.json(await getPromos());
}
