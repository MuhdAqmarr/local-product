"use client";

import { useState, type CSSProperties } from "react";
import { BrandCard, type BrandCardData } from "@/components/brand/brand-card";
import { LoadMore } from "@/components/product/load-more";
import { Button } from "@/components/ui/button";
import { TIER_BY_SLUG } from "@/lib/taxonomy";
import { useScope } from "./tier-scope";

const STEP = 12;

/**
 * "Jenama {nameMs}" grid (DESIGN §8.6): one responsive BrandCard per brand (a row below 480 px,
 * kedai cards 2 / 3 / 4 columns above),
 * 12 at a time with "Muat lagi". Follows the page's tier scope (client state, no network).
 */
export function CategoryBrands({ brands, nameMs }: { brands: BrandCardData[]; nameMs: string }) {
  const scope = useScope();
  // Remember how far each scope was expanded, so switching back does not collapse the list.
  const [shownBy, setShownBy] = useState<Record<string, number>>({});
  const list = scope === "all" ? brands : brands.filter((b) => b.tier === scope);
  const shown = Math.min(list.length, shownBy[scope] ?? STEP);

  if (list.length === 0) {
    const tierName = scope === "all" ? null : TIER_BY_SLUG[scope].name;
    return (
      <div className="flex flex-col items-start gap-3 rounded-card border-2 border-dashed border-garis-kuat bg-putih/70 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body text-ink-2">
          {tierName ? (
            <>
              Belum ada jenama {tierName} dalam {nameMs}. Kenal satu? Cadangkan!
            </>
          ) : (
            <>Rak ni kosong lagi. Kenal jenama {nameMs} lokal? Cadangkan!</>
          )}
        </p>
        <Button href="/about#cadang" variant="secondary" size="sm" trailing="arrow">
          Cadang jenama
        </Button>
      </div>
    );
  }

  return (
    <>
      <ul role="list" className="grid grid-cols-1 gap-2.5 xs:grid-cols-2 xs:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {list.slice(0, shown).map((b, i) => {
          const later = i >= STEP;
          return (
            <li
              key={b.slug}
              className={later ? "min-w-0 animate-rise-in" : "min-w-0"}
              style={later ? ({ animationDelay: `${Math.min(i % STEP, 5) * 50}ms` } as CSSProperties) : undefined}
            >
              <BrandCard brand={b} layout="auto" />
            </li>
          );
        })}
      </ul>
      <LoadMore
        shown={shown}
        total={list.length}
        noun="jenama"
        onMore={() => setShownBy((prev) => ({ ...prev, [scope]: shown + STEP }))}
      />
    </>
  );
}
