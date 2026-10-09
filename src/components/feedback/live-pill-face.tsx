"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCwOff } from "@/components/ui/lucide";
import { useI18n } from "@/i18n/client";
import { timeAgo } from "@/lib/format";
import { formatClock, syncState, SYNC_COPY, type SyncSource, type SyncState } from "@/lib/freshness";
import { cn } from "@/lib/utils";
import { useNow } from "./live-time";
import { toast } from "./toast-store";

export interface LivePillFaceProps {
  iso?: string;
  source?: SyncSource;
  /** State the server computed (age 0). The client re-evaluates against the real clock after mount. */
  initialState: SyncState;
  size?: "md" | "sm";
  /** Site pill only: on tab focus after > 20 min, refresh the route and ping/toast when a newer sync landed. */
  watch?: boolean;
  /** Current site promo count, for the "Sync baru masuk" toast diff. */
  promos?: number;
}

const LOOK: Record<SyncState, string> = {
  fresh: "bg-pandan-tint text-pandan-pekat",
  stale: "bg-mangga-tint text-kunyit-pekat",
  old: "bg-kapas text-ink-soft",
  none: "bg-kapas text-ink-soft",
};

const REFRESH_AFTER_MS = 20 * 60 * 1000;
let lastSeenPromos: number | null = null;

export function LivePillFace({ iso, source, initialState, size = "md", watch = false, promos }: LivePillFaceProps) {
  const now = useNow();
  const router = useRouter();
  const state: SyncState = now == null || !iso ? initialState : syncState(iso, source, now);
  const [pingKey, setPingKey] = useState(0);
  const lastIso = useRef(iso);
  const lastCheck = useRef(0);
  const { m, locale, plural } = useI18n();
  const copy = SYNC_COPY[locale];

  // A newer syncedAt arrived (after router.refresh()): ping 3 more times and say so.
  useEffect(() => {
    if (!iso || lastIso.current === iso) return;
    lastIso.current = iso;
    setPingKey((k) => k + 1);
    if (watch && promos != null && lastSeenPromos != null && promos > lastSeenPromos) {
      toast({ message: plural(promos - lastSeenPromos, m.common.live.newSync), tone: "success" });
    }
  }, [iso, watch, promos, m, plural]);

  useEffect(() => {
    if (watch && promos != null) lastSeenPromos = promos;
  }, [watch, promos]);

  useEffect(() => {
    if (!watch) return;
    lastCheck.current = Date.now();
    const onVisibility = () => {
      if (document.hidden || Date.now() - lastCheck.current < REFRESH_AFTER_MS) return;
      lastCheck.current = Date.now();
      startTransition(() => router.refresh());
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [watch, router]);

  const label =
    state === "none" || !iso ? null : now == null ? formatClock(iso, locale) : timeAgo(iso, now, locale);

  return (
    <span
      data-state={state}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold leading-none whitespace-nowrap",
        size === "md" ? "h-7 px-3 text-[12px]" : "h-6 px-2.5 text-[11px]",
        LOOK[state],
      )}
    >
      {state === "none" ? (
        <RefreshCwOff aria-hidden size={14} strokeWidth={2.25} />
      ) : (
        <span
          key={pingKey}
          aria-hidden
          className={cn("live-dot shrink-0", state === "old" && "border-[1.5px] border-ink-soft !bg-transparent")}
          style={{ ["--dot" as string]: state === "fresh" ? "var(--color-live)" : "var(--color-stale)" }}
          data-ping={state === "fresh" ? "" : undefined}
        />
      )}
      {state === "fresh" ? (
        <span>
          <span className="font-num text-[13px] tracking-wide">{m.common.live.tag}</span> · {copy.fresh} <time dateTime={iso}>{label}</time>
        </span>
      ) : state === "none" ? (
        <span>{copy.none}</span>
      ) : (
        <span>
          {copy[state]} · <time dateTime={iso}>{label}</time>
        </span>
      )}
    </span>
  );
}
