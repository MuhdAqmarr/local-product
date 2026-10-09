"use client";

import { useEffect, useState } from "react";
import { Search } from "@/components/ui/lucide";
import { Kbd } from "@/components/ui/kbd";
import { popStyle } from "@/components/ui/pop";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/client";
import { preloadSearch, useSearch } from "./search-provider";

export type SearchTriggerVariant = "pill" | "icon" | "tab";

/** "⌘K" on Apple platforms, "Ctrl K" elsewhere; null until mounted (no hydration mismatch). */
function useShortcutLabel() {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- platform is only knowable after mount
    setLabel(/mac|iphone|ipad/i.test(platform) ? "⌘K" : "Ctrl K");
  }, []);
  return label;
}

/**
 * Opens the search dialog (DESIGN §6.4).
 * - `pill`: desktop header pill (≤ 300 × 44, white, 2 px ink, pop) with the ⌘K / Ctrl K hint; the hint
 *   drops when the pill is squeezed under 220 px (header at 1024–1179 px) so the label stays readable.
 * - `icon`: 44 px icon button.
 * - `tab`: the raised 56 px bandung "Search" button in the bottom tab bar.
 * Warms the dialog chunk + `/api/feed/search` on pointerenter / focus / touchstart.
 */
export function SearchTrigger({ variant = "pill", className }: { variant?: SearchTriggerVariant; className?: string }) {
  const { open } = useSearch();
  const shortcut = useShortcutLabel();
  const t = useI18n().m.common.searchTrigger;
  const intent = { onPointerEnter: () => preloadSearch(), onFocus: () => preloadSearch(), onTouchStart: () => preloadSearch() };

  if (variant === "tab") {
    return (
      <button
        type="button"
        onClick={() => open()}
        {...intent}
        aria-label={t.label}
        aria-haspopup="dialog"
        className={cn("group relative flex h-full flex-col items-center justify-end pb-1.5", className)}
      >
        <span className="pop absolute -top-4 left-1/2 -translate-x-1/2" style={popStyle({ offset: 4 })}>
          <span className="pop-face size-14 bg-bandung text-ink">
            <Search aria-hidden size={24} strokeWidth={2.5} />
          </span>
        </span>
        <span aria-hidden className="text-tab text-ink">
          {t.tab}
        </span>
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => open()}
        {...intent}
        aria-label={t.label}
        aria-haspopup="dialog"
        className={cn("pop shrink-0", className)}
        style={popStyle({ offset: 2 })}
      >
        <span className="pop-face size-11 bg-putih text-ink">
          <Search aria-hidden size={20} strokeWidth={2.25} />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => open()}
      {...intent}
      aria-label={t.label}
      aria-haspopup="dialog"
      className={cn("pop @container w-[300px] shrink-0", className)}
      style={popStyle({ offset: 2 })}
    >
      <span className="pop-face h-11 w-full !justify-start gap-2.5 bg-putih pl-4 pr-2 text-ink">
        <Search aria-hidden size={18} strokeWidth={2.25} />
        <span className="min-w-0 flex-1 truncate text-left text-[14px] text-ink-soft">{t.placeholder}</span>
        <Kbd className={cn("transition-opacity duration-200 pointer-coarse:hidden @max-[220px]:hidden", shortcut ? "opacity-100" : "opacity-0")}>{shortcut ?? "⌘K"}</Kbd>
      </span>
    </button>
  );
}
