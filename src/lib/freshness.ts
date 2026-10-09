import type { Locale } from "@/i18n/config";
import type { FeedStatus } from "./types";

/**
 * Sync freshness (DESIGN §0.3 #21, §6.10):
 * - fresh: at most 4 h old (the background refresh runs about every 3 h)
 * - stale: 4–24 h old
 * - old:   more than 24 h old, or the brand's store has never been read
 *
 * Freshness follows the age of the data, not where it was served from: every deploy
 * syncs the snapshot right before building, so a "snapshot" read can be minutes old,
 * and a brand whose latest refresh failed keeps the timestamp of its last good read.
 * - none:  the brand has no readable store
 */
export type SyncState = "fresh" | "stale" | "old" | "none";

export const FRESH_MS = 4 * 60 * 60 * 1000;
export const OLD_MS = 24 * 60 * 60 * 1000;

/** Site source ("live" | "snapshot") or a brand's feed status ("live" | "snapshot" | "error"). */
export type SyncSource = "live" | "snapshot" | FeedStatus["status"];

/**
 * Pure and deterministic. `now` is required on purpose: Server Components pass the
 * catalog's `syncedAt` (age 0), client islands pass `Date.now()` after mount.
 */
export function syncState(iso: string | undefined, source: SyncSource | undefined, now: number): SyncState {
  if (!iso || !source) return "none";
  if (source === "error") return "old";
  const age = Math.max(0, now - Date.parse(iso));
  if (Number.isNaN(age) || age > OLD_MS) return "old";
  if (age > FRESH_MS) return "stale";
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

/** Pill copy prefix per state and language (DESIGN §9.9). The relative time is appended by the caller. */
export const SYNC_COPY: Record<Locale, Record<SyncState, string>> = {
  en: {
    fresh: "updated",
    stale: "Sync running late",
    old: "Data may be outdated",
    none: "This store can't sync yet",
  },
  ms: {
    fresh: "dikemas kini",
    stale: "Sync lambat sikit",
    old: "Data mungkin lapuk",
    none: "Kedai ni belum boleh disync",
  },
};

const TZ = "Asia/Kuala_Lumpur";

/** Malaysia-time parts, deterministic on server and client (fixed time zone, numeric parts only). */
function myParts(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  return { day: Number(get("day")), month: Number(get("month")), year: Number(get("year")), hour: Number(get("hour")) % 24, minute: get("minute") };
}

/**
 * Clock time in Malaysia: "3:40 PM" (en) / "3:40 PTG" (ms: PG, TGH, PTG, MLM).
 * Built from numeric parts, so server and browser always agree (no ICU differences).
 */
export function formatClock(iso: string, locale: Locale): string {
  const p = myParts(iso);
  if (!p) return "";
  const h12 = p.hour % 12 === 0 ? 12 : p.hour % 12;
  const suffix = locale === "ms" ? (p.hour < 12 ? "PG" : p.hour < 14 ? "TGH" : p.hour < 19 ? "PTG" : "MLM") : p.hour < 12 ? "AM" : "PM";
  return `${h12}:${p.minute} ${suffix}`;
}

export const MONTHS_SHORT: Record<Locale, readonly string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ms: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"],
};

/** "9 Oct 2026" (en) / "9 Okt 2026" (ms), in Malaysia time. */
export function formatDate(iso: string, locale: Locale): string {
  const p = myParts(iso);
  if (!p) return "";
  return `${p.day} ${MONTHS_SHORT[locale][p.month - 1]} ${p.year}`;
}

/** "9 Oct 2026, 3:40 PM" / "9 Okt 2026, 3:40 PTG". */
export function formatDateTime(iso: string, locale: Locale): string {
  const date = formatDate(iso, locale);
  return date ? `${date}, ${formatClock(iso, locale)}` : "";
}
