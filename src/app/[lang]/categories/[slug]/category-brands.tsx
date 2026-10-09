"use client";

import { useState, type CSSProperties } from "react";
import { BrandCard, type BrandCardData } from "@/components/brand/brand-card";
import { LoadMore } from "@/components/product/load-more";
import { Button } from "@/components/ui/button";
import { TIER_BY_SLUG } from "@/lib/taxonomy";
import { useScope } from "./tier-scope";
import { useI18n } from "@/i18n/client";

const STEP = 12;

/**
 * "{Category} brands" grid (DESIGN §8.6): one responsive BrandCard per brand (a row below 480 px,
 * kedai cards 2 / 3 / 4 columns above),
 * 12 at a time with "Load more". Follows the page's tier scope (client state, no network).
 * `name` is the category name in the page language, `label` its short lowercase label.
 */
export function CategoryBrands({ brands, name, label }: { brands: BrandCardData[]; name: string; label: string }) {
  const { locale, m, fmt } = useI18n();
  const t = m.categories.brands;
  const scope = useScope();
  // Remember how far each scope was expanded, so switching back does not collapse the list.
  const [shownBy, setShownBy] = useState<Record<string, number>>({});
  const list = scope === "all" ? brands : brands.filter((b) => b.tier === scope);
  const shown = Math.min(list.length, shownBy[scope] ?? STEP);

  if (list.length === 0) {
    const tierName = scope === "all" ? null : TIER_BY_SLUG[scope].name;
    return (
      <div className="flex flex-col items-start gap-3 rounded-card border-2 border-dashed border-garis-kuat bg-putih/70 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body text-ink-2">{tierName ? fmt(t.emptyTier, { tier: tierName, name }) : fmt(t.empty, { label })}</p>
        <Button href="/about#cadang" variant="secondary" size="sm" trailing="arrow">
          {t.suggest}
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
              <BrandCard locale={locale} brand={b} layout="auto" />
            </li>
          );
        })}
      </ul>
      <LoadMore
        shown={shown}
        total={list.length}
        noun={t.noun}
        onMore={() => setShownBy((prev) => ({ ...prev, [scope]: shown + STEP }))}
      />
    </>
  );
}
