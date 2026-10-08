"use client";

import { createContext, startTransition, useContext, useEffect, useState, type ReactNode } from "react";
import { TierIcon } from "@/components/art/tier-icon";
import { Segmented } from "@/components/ui/segmented";
import type { TierSlug } from "@/lib/types";
import "./scope.css";

export type Scope = "all" | TierSlug;

const SCOPES: readonly Scope[] = ["all", "cili-padi", "naik-daun", "ikon"];

const OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "cili-padi", label: <Short short="Cili" full="Cili Padi" />, ariaLabel: "Cili Padi", icon: <TierIcon tier="cili-padi" size={18} /> },
  { value: "naik-daun", label: <Short short="Daun" full="Naik Daun" />, ariaLabel: "Naik Daun", icon: <TierIcon tier="naik-daun" size={18} /> },
  { value: "ikon", label: <Short short="Ikon" full="Jenama Ikon" />, ariaLabel: "Jenama Ikon", icon: <TierIcon tier="ikon" size={18} /> },
] as const satisfies readonly { value: Scope; label: ReactNode; icon?: ReactNode; ariaLabel?: string }[];

/** Short label on phones (equal-width cells truncate), full name from 1024 px. */
function Short({ short, full }: { short: string; full: string }) {
  return (
    <>
      <span className="lg:hidden">{short}</span>
      <span className="hidden lg:inline">{full}</span>
    </>
  );
}

const ScopeContext = createContext<Scope>("all");

/** The tier currently scoping the category page ("all" on the server and during hydration). */
export function useScope() {
  return useContext(ScopeContext);
}

function isScope(value: string | null): value is Scope {
  return value != null && (SCOPES as readonly string[]).includes(value);
}

/**
 * Tier segmented control that scopes every section below it (DESIGN §8.6). Server-rendered
 * sections mark items with `data-in="all cili-padi …"`; the wrapper's `data-scope` hides the rest
 * in CSS (scope.css), so switching is instant and needs no network. `?tier=` is read after mount
 * and written with `history.replaceState` (server HTML stays the default "Semua" view).
 */
export function TierScope({ children, label }: { children: ReactNode; label: string }) {
  const [scope, setScope] = useState<Scope>("all");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("tier");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL state is client-only; read once after hydration
    if (isScope(initial) && initial !== "all") setScope(initial);
  }, []);

  const change = (next: Scope) => {
    setTouched(true);
    startTransition(() => {
      setScope(next);
      const url = new URL(window.location.href);
      if (next === "all") url.searchParams.delete("tier");
      else url.searchParams.set("tier", next);
      window.history.replaceState(window.history.state, "", url);
    });
  };

  return (
    <ScopeContext.Provider value={scope}>
      <div className="sticky-stack -mt-px border-b-2 border-transparent bg-santan/96 py-2.5">
        <div className="container-page flex items-center gap-3">
          <span className="hidden shrink-0 text-overline uppercase text-ink-soft md:inline">Saiz jenama</span>
          <Segmented options={OPTIONS} value={scope} onChange={change} label={label} className="w-full max-w-[520px] lg:max-w-[620px]" />
        </div>
      </div>
      <div data-scope={scope} data-touched={touched ? "" : undefined} className="scope-root">
        {children}
      </div>
    </ScopeContext.Provider>
  );
}
