import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const TZ = "Asia/Kuala_Lumpur";
const HARI = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"] as const;
const BULAN = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"] as const;

interface DayParts {
  y: number;
  m: number;
  d: number;
  wd: number;
}

const partsFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "numeric", day: "numeric" });

/** Calendar date in Malaysia time (deterministic on server and client). */
export function myDay(iso: string): DayParts {
  const parts = Object.fromEntries(partsFmt.formatToParts(new Date(iso)).map((p) => [p.type, p.value]));
  const y = Number(parts.year);
  const m = Number(parts.month) - 1;
  const d = Number(parts.day);
  return { y, m, d, wd: new Date(Date.UTC(y, m, d)).getUTCDay() };
}

/** "2026-10-08" in Malaysia time: a stable key for grouping launches by day. */
export function myDayKey(iso: string): string {
  const { y, m, d } = myDay(iso);
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** "Hari ni" / "Semalam" / "Khamis, 2 Okt", relative to `reference` (the catalog's syncedAt). */
export function dayLabel(iso: string, reference: string): string {
  const a = myDay(iso);
  const b = myDay(reference);
  const diff = Math.round((Date.UTC(b.y, b.m, b.d) - Date.UTC(a.y, a.m, a.d)) / 86_400_000);
  if (diff === 0) return "Hari ni";
  if (diff === 1) return "Semalam";
  return `${HARI[a.wd]}, ${a.d} ${BULAN[a.m]}${a.y !== b.y ? ` ${a.y}` : ""}`;
}

export interface KalendarKoyakProps {
  /** Any timestamp on that day (ISO). */
  date: string;
  /** The catalog's syncedAt, for "Hari ni" / "Semalam". */
  reference: string;
  count?: number;
  /** Sticky offset under the header + filter bar. Pass `null` for a static header. */
  /**
   * Omit: sticks 8 px under header + filter bar and moves with the header stack (`.sticky-sub`).
   * A CSS length: sticky at that `top` instead. `null`: not sticky.
   */
  stickyTop?: string | null;
  className?: string;
}

const TORN = "conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 8px 100%";

/**
 * /new tear-off calendar day header (DESIGN §8.3, Appendix D #21): bandung binding with two
 * santan ring holes, Fredoka day number, caps month, Malay weekday, zig-zag torn bottom edge.
 */
export function KalendarKoyak({ date, reference, count, stickyTop, className }: KalendarKoyakProps) {
  const day = myDay(date);
  const label = dayLabel(date, reference);
  const full = `${HARI[day.wd]}, ${day.d} ${BULAN[day.m]} ${day.y}`;

  return (
    <h2
      className={cn(
        "flex items-center gap-3",
        stickyTop !== null && "-mx-(--gutter) bg-santan/96 px-(--gutter) py-1.5",
        stickyTop === undefined ? "sticky-sub" : stickyTop !== null && "sticky z-20",
        className,
      )}
      style={stickyTop === undefined ? ({ "--sub-top": "calc(var(--filterbar-h) + 8px)" } as CSSProperties) : stickyTop !== null ? { top: stickyTop } : undefined}
    >
      <span aria-hidden="true" className="relative block h-[72px] w-16 shrink-0 rotate-[-2deg] drop-shadow-[2px_3px_0_rgb(43_23_54_/_0.18)]">
        <span className="absolute inset-0 flex flex-col overflow-hidden rounded-t-[10px] border-2 border-b-0 border-ink bg-putih" style={{ mask: TORN, WebkitMask: TORN }}>
          <span className="relative flex h-[18px] shrink-0 items-center justify-center gap-5 border-b-2 border-ink bg-bandung">
            <i className="size-1.5 rounded-full bg-santan shadow-[inset_0_0_0_1.5px_var(--color-ink)]" />
            <i className="size-1.5 rounded-full bg-santan shadow-[inset_0_0_0_1.5px_var(--color-ink)]" />
          </span>
          <span className="flex flex-1 flex-col items-center justify-center pb-1.5 leading-none">
            <span className="font-num text-[26px] leading-none text-ink">{day.d}</span>
            <span className="mt-0.5 text-[10px] font-semibold tracking-[0.08em] text-ink-soft uppercase">{BULAN[day.m]}</span>
          </span>
        </span>
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-title-3 text-ink">
          <time dateTime={myDayKey(date)} title={full}>
            {label}
          </time>
        </span>
        <span className="text-caption text-ink-soft">
          {label === "Hari ni" || label === "Semalam" ? `${HARI[day.wd]} · ` : ""}
          {count != null ? `${count} produk` : full}
        </span>
      </span>
    </h2>
  );
}
