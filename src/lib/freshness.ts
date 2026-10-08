import type { FeedStatus } from "./types";

/**
 * Sync freshness (DESIGN §0.3 #21, §6.10):
 * - fresh: a live read, at most 4 h old (the background refresh runs about every 3 h)
 * - stale: 4–24 h old, or served from the build snapshot
 * - old:   more than 24 h old, or the brand's store failed to read
 * - none:  the brand has no readable store
 */
export type SyncState = "fresh" | "stale" | "old" | "none";

export const FRESH_MS = 4 * 60 * 60 * 1000;
export const OLD_MS = 24 * 60 * 60 * 1000;

/** Site source ("live" | "snapshot") or a brand's feed status ("live" | "snapshot" | "error"). */
export type SyncSource = "live" | "snapshot" | FeedStatus["status"];

/**
 * Pure and deterministic. `now` is required on purpose: Server Components pass the
 * catalog's `syncedAt` (age 0, so the state follows the source alone), client
 * islands pass `Date.now()` after mount.
 */
export function syncState(iso: string | undefined, source: SyncSource | undefined, now: number): SyncState {
  if (!iso || !source) return "none";
  if (source === "error") return "old";
  const age = Math.max(0, now - Date.parse(iso));
  if (Number.isNaN(age) || age > OLD_MS) return "old";
  if (source === "snapshot" || age > FRESH_MS) return "stale";
  return "fresh";
}

/** State for a single brand: no feed configured → "none"; otherwise its feed status + fetchedAt. */
export function brandSyncState(
  hasFeed: boolean,
  status: Pick<FeedStatus, "status" | "fetchedAt"> | undefined,
  fallbackIso: string,
  now: number,
): SyncState {
  if (!hasFeed) return "none";
  if (!status) return "old";
  return syncState(status.fetchedAt ?? fallbackIso, status.status, now);
}

/** Pill copy prefix per state (DESIGN §9.9). The relative time is appended by the caller. */
export const SYNC_COPY: Record<SyncState, string> = {
  fresh: "dikemas kini",
  stale: "Sync lambat sikit",
  old: "Data mungkin lapuk",
  none: "Kedai ni belum boleh disync",
};

const TZ = "Asia/Kuala_Lumpur";

/** "3:40 PTG" — deterministic on server and client (fixed time zone). */
export function formatClock(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: false, timeZone: TZ }).formatToParts(d);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const min = parts.find((p) => p.type === "minute")?.value ?? "00";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const suffix = h < 12 ? "PG" : h < 14 ? "TGH" : h < 19 ? "PTG" : "MLM";
  return `${h12}:${min} ${suffix}`;
}

const MONTHS = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"];

/** "9 Okt 2026" in Malaysia time. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "numeric", year: "numeric", timeZone: TZ }).formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return `${get("day")} ${MONTHS[get("month") - 1]} ${get("year")}`;
}
