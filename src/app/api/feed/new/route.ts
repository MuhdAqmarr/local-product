import { getNewLaunches } from "@/lib/catalog";

/** Every product launched in the last NEW_WINDOW_DAYS days, newest first. */
export async function GET() {
  return Response.json(await getNewLaunches());
}
