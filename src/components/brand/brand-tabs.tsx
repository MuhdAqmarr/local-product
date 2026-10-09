"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useLenis } from "lenis/react";
import { BadgePercent, Sparkles } from "@/components/ui/lucide";
import { prefersLessMotion } from "@/components/providers/motion-pref";
import { panelId, tabId, Tabs } from "@/components/ui/tabs";
import { headerOffset } from "./scroll-offset";

export type BrandTab = "promo" | "baru";

export interface BrandTabsProps {
  promoCount: number;
  baruCount: number;
  /** Server-rendered panels; both stay in the DOM, the hidden one gets `hidden`. */
  promo: ReactNode;
  baru: ReactNode;
  /** Promo when the brand has promos, else Baru (DESIGN §6.17). */
  initial: BrandTab;
}

const BASE = "kedai";
const isTab = (v: string): v is BrandTab => v === "promo" || v === "baru";

/**
 * Brand profile Promo / Baru tabs (DESIGN §6.17, §8.5 #6): sticky under the header (part of the
 * sticky stack), state in the URL hash (#promo / #baru, `history.replaceState`), panels toggle
 * `hidden` instantly and fade in via @starting-style. In-panel links to "#promo" / "#baru" switch tabs.
 */
export function BrandTabs({ promoCount, baruCount, promo, baru, initial }: BrandTabsProps) {
  const [tab, setTab] = useState<BrandTab>(initial);
  const rootRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  // Hash is client-only state: read after mount (and on every Activity re-show).
  useEffect(() => {
    const h = window.location.hash.slice(1);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL hash is client-only; read once after hydration
    if (isTab(h)) setTab(h);
  }, []);

  const choose = useCallback(
    (next: BrandTab) => {
      setTab(next);
      try {
        const url = window.location.pathname + window.location.search + `#${next}`;
        window.history.replaceState(window.history.state, "", url);
      } catch {
        /* hash sync is a convenience */
      }
      // If the reader is deep in the grid, bring the new panel's top back under the sticky tabs.
      const root = rootRef.current;
      if (!root) return;
      const header = headerOffset();
      const top = root.getBoundingClientRect().top;
      if (top >= header - 1) return;
      const y = window.scrollY + top - header;
      if (lenis) lenis.scrollTo(y, { immediate: prefersLessMotion(), duration: 0.5 });
      else window.scrollTo({ top: y });
    },
    [lenis],
  );

  const onClickCapture = (event: MouseEvent) => {
    const a = (event.target as Element).closest?.("a[href^='#']");
    const v = a?.getAttribute("href")?.slice(1) ?? "";
    if (!isTab(v)) return;
    event.preventDefault();
    choose(v);
    requestAnimationFrame(() => document.getElementById(tabId(BASE, v))?.focus({ preventScroll: true }));
  };

  return (
    <section ref={rootRef} aria-labelledby="kedai-produk-title" onClickCapture={onClickCapture}>
      <h2 id="kedai-produk-title" className="sr-only">
        Produk kedai
      </h2>
      {/* Hash targets (#promo / #baru) so deep links and smooth-scroll anchors land on the tabs. */}
      <span id="promo" aria-hidden className="block scroll-mt-(--header-total)" />
      <span id="baru" aria-hidden className="block scroll-mt-(--header-total)" />
      <div className="sticky-stack -mx-(--gutter) bg-santan/96 px-(--gutter) py-2.5 shadow-[0_2px_0_-1px_var(--color-garis)]">
        <Tabs
          base={BASE}
          label="Produk kedai"
          value={tab}
          onChange={choose}
          className="max-w-[440px]"
          items={[
            { value: "promo", label: "Promo", count: promoCount, icon: <BadgePercent aria-hidden /> },
            { value: "baru", label: "Baru", count: baruCount, icon: <Sparkles aria-hidden /> },
          ]}
        />
      </div>
      <div role="tabpanel" id={panelId(BASE, "promo")} aria-labelledby={tabId(BASE, "promo")} className="tab-panel pt-5" hidden={tab !== "promo"}>
        {promo}
      </div>
      <div role="tabpanel" id={panelId(BASE, "baru")} aria-labelledby={tabId(BASE, "baru")} className="tab-panel pt-5" hidden={tab !== "baru"}>
        {baru}
      </div>
    </section>
  );
}
