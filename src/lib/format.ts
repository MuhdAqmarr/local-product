import type { Locale } from "@/i18n/config";
import { plural, type Plural } from "@/i18n/format";

/** RM29 / RM29.90 for ringgit; Intl currency format for anything else. */
export function formatPrice(amount: number, currency = "MYR"): string {
  if (currency === "MYR") return `RM${Number.isInteger(amount) ? amount.toFixed(0) : amount.toFixed(2)}`;
  try {
    return new Intl.NumberFormat("en-MY", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

const AGO: Record<Locale, { now: string; min: Plural; hour: Plural; day: Plural; week: Plural; month: Plural; year: Plural }> = {
  en: {
    now: "just now",
    min: { one: "{count} min ago", other: "{count} min ago" },
    hour: { one: "{count} hour ago", other: "{count} hours ago" },
    day: { one: "{count} day ago", other: "{count} days ago" },
    week: { one: "{count} week ago", other: "{count} weeks ago" },
    month: { one: "{count} month ago", other: "{count} months ago" },
    year: { one: "{count} year ago", other: "{count} years ago" },
  },
  ms: {
    now: "baru tadi",
    min: { one: "{count} min lepas", other: "{count} min lepas" },
    hour: { one: "{count} jam lepas", other: "{count} jam lepas" },
    day: { one: "{count} hari lepas", other: "{count} hari lepas" },
    week: { one: "{count} minggu lepas", other: "{count} minggu lepas" },
    month: { one: "{count} bulan lepas", other: "{count} bulan lepas" },
    year: { one: "{count} tahun lepas", other: "{count} tahun lepas" },
  },
};

/**
 * Relative time in the page language: "just now", "12 min ago", "3 hours ago" /
 * "baru tadi", "12 min lepas", "3 jam lepas". Pure: pass `now` (server: the catalog's syncedAt;
 * client: Date.now() after mount).
 */
export function timeAgo(iso: string, now: number, locale: Locale): string {
  const t = AGO[locale] ?? AGO.en;
  const seconds = Math.max(0, Math.round((now - Date.parse(iso)) / 1000));
  if (!Number.isFinite(seconds) || seconds < 60) return t.now;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return plural(minutes, t.min);
  const hours = Math.round(minutes / 60);
  if (hours < 24) return plural(hours, t.hour);
  const days = Math.round(hours / 24);
  if (days < 7) return plural(days, t.day);
  const weeks = Math.round(days / 7);
  if (days < 30) return plural(weeks, t.week);
  const months = Math.round(days / 30);
  if (months < 12) return plural(months, t.month);
  return plural(Math.round(months / 12), t.year);
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-MY").format(value);
}

/** Tag outbound links so brands can see the traffic we send them. */
export function outboundUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "lokallah");
    u.searchParams.set("utm_medium", "referral");
    return u.toString();
  } catch {
    return url;
  }
}
