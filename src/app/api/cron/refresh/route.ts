import { revalidateTag } from "next/cache";

/**
 * Daily Vercel Cron (see vercel.json). Marks the store catalog stale so the next
 * visit re-reads every brand's store, on top of the 3-hourly background refresh.
 * Vercel sends `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is set.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  revalidateTag("catalog", "max");
  return Response.json({ ok: true, revalidated: "catalog" });
}
