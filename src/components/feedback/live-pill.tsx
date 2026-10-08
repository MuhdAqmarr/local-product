import { useId } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FeedStatus } from "@/lib/types";
import { brandSyncState, formatClock, formatDate, syncState, type SyncSource } from "@/lib/freshness";
import { cn } from "@/lib/utils";
import { LivePillFace } from "./live-pill-face";

export interface LivePillProps {
  /** Site: `stats.syncedAt`. Brand: catalog `syncedAt` (used when the feed has no fetchedAt). */
  syncedAt: string;
  /** Site mode: `stats.source`. */
  source?: "live" | "snapshot";
  /** Site mode: shown in the popover ("{liveBrands} jenama") with a proportion bar. */
  liveBrands?: number;
  brands?: number;
  /** Brand mode: pass the brand's feed status and whether it has a feed at all. */
  brand?: { name: string; hasFeed: boolean; status?: FeedStatus };
  /** Site pill on listing pages: refresh on tab focus and toast new syncs. */
  watch?: boolean;
  promos?: number;
  size?: "md" | "sm";
  className?: string;
}

/**
 * Live-sync indicator (DESIGN §6.10). Server Component: computes the state at age 0 (no clock on
 * the server), prints an absolute time; `LivePillFace` re-evaluates fresh/stale/old against the
 * real clock after mount. Tapping opens a native popover explaining how syncing works.
 * Renders a <div>: do not place it inside a <p>.
 */
export function LivePill({ syncedAt, source, liveBrands, brands, brand, watch, promos, size = "md", className }: LivePillProps) {
  const raw = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = `sync-${raw}`;
  const base = Date.parse(syncedAt);

  let iso: string | undefined = syncedAt;
  let src: SyncSource | undefined = source ?? "snapshot";
  let initial = syncState(syncedAt, src, base);
  if (brand) {
    iso = brand.hasFeed ? (brand.status?.fetchedAt ?? syncedAt) : undefined;
    src = brand.hasFeed ? (brand.status?.status ?? "error") : undefined;
    initial = brandSyncState(brand.hasFeed, brand.status, syncedAt, Date.parse(iso ?? syncedAt));
  }

  const when = iso ? `${formatDate(iso)}, ${formatClock(iso)}` : null;
  const ratio = liveBrands != null && brands ? Math.min(1, liveBrands / brands) : null;

  return (
    <div className={cn("relative inline-flex", className)}>
      <button
        type="button"
        popoverTarget={id}
        className="rounded-full"
        style={{ ["anchorName" as string]: `--${id}` }}
      >
        <LivePillFace iso={iso} source={src} initialState={initial} size={size} watch={watch} promos={promos} />
        <span className="sr-only"> (cara kami sync)</span>
      </button>
      <div
        id={id}
        popover="auto"
        role="dialog"
        aria-label="Cara kami sync"
        data-align="start"
        className="pop-panel anchored-panel w-[min(320px,calc(100vw-32px))] rounded-card-lg border-2 border-ink bg-putih p-4 text-left text-ink shadow-float"
        style={{ ["positionAnchor" as string]: `--${id}` }}
      >
        {brand ? (
          brand.hasFeed ? (
            <p className="text-body-sm text-ink-2">
              Kami semak kedai rasmi {brand.name} lebih kurang setiap 3 jam.{when && <> Semakan terakhir: {when}.</>}
              {brand.status?.status === "error" && <> Semakan terakhir tak berjaya, jadi data mungkin lapuk.</>}
            </p>
          ) : (
            <p className="text-body-sm text-ink-2">Kedai jenama ni belum boleh di-sync automatik. Tengok terus kat kedai rasmi diorang.</p>
          )
        ) : (
          <>
            <p className="text-body-sm text-ink-2">
              Kami semak kedai rasmi {liveBrands ?? "setiap"} jenama lebih kurang setiap 3 jam.{when && <> Sync terakhir: {when}.</>}
            </p>
            {source === "snapshot" && <p className="mt-2 text-caption text-kunyit-pekat">Data ni dari salinan terakhir yang kami simpan, bukan bacaan live.</p>}
            {ratio != null && (
              <div className="mt-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-kapas">
                  <div className="h-full origin-left rounded-full bg-live" style={{ transform: `scaleX(${ratio})` }} />
                </div>
                <p className="mt-1.5 text-caption text-ink-soft">
                  {liveBrands} daripada {brands} jenama ada kedai yang boleh dibaca live.
                </p>
              </div>
            )}
          </>
        )}
        <Link href="/about#sync" className="group mt-3 inline-flex min-h-11 items-center gap-1 text-label text-telang">
          Cara kami sync
          <ArrowRight aria-hidden size={16} className="transition-transform duration-200 group-hover:translate-x-[3px]" />
        </Link>
      </div>
    </div>
  );
}
