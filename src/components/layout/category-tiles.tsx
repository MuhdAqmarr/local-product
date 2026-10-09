import { Link } from "@/i18n/link";
import { LayoutGrid } from "@/components/ui/lucide";
import { TierIcon } from "@/components/art/tier-icon";
import { CategoryGlyph } from "@/components/product/category-glyph";
import type { Locale } from "@/i18n/config";
import { plural } from "@/i18n/format";
import { commonFor } from "@/i18n/shared";
import { TIERS } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import type { NavCategory } from "./nav-data";

/**
 * Compact category tiles for the Kategori popover (desktop) and sheet (mobile):
 * 11 categories + "Semua jenama", each squircle in the category's `mid` with an ink icon.
 * Hook-free: usable from the server popover and the client sheet (pass the page `locale`).
 */
export function CategoryTiles({ categories, locale, onNavigate, dense = false }: { categories: NavCategory[]; locale: Locale; onNavigate?: () => void; dense?: boolean }) {
  const total = categories.reduce((n, c) => n + c.brands, 0);
  const t = commonFor(locale).kategori;
  return (
    <ul className={cn("grid gap-x-2 gap-y-3", dense ? "grid-cols-4" : "grid-cols-3")}>
      {categories.map((c) => (
        <li key={c.slug} data-cat={c.slug}>
          <Link
            href={`/categories/${c.slug}`}
            onClick={onNavigate}
            transitionTypes={["nav-forward"]}
            className="group flex flex-col items-center gap-1.5 rounded-[18px] p-1.5 text-center transition-colors hover:bg-kapas"
          >
            <span className="grid size-12 place-items-center rounded-[16px] border-2 border-ink bg-(--cat-mid) text-ink transition-transform duration-200 ease-pop group-hover:-translate-y-1 group-active:scale-x-105 group-active:scale-y-95">
              <CategoryGlyph category={c.slug} size={22} />
            </span>
            <span className="text-label-sm leading-tight text-ink [overflow-wrap:anywhere]">{c.label}</span>
            <span className="text-caption leading-none text-ink-soft">{plural(c.brands, t.brandCount)}</span>
          </Link>
        </li>
      ))}
      <li>
        <Link
          href="/brands"
          onClick={onNavigate}
          transitionTypes={["nav-forward"]}
          className="group flex flex-col items-center gap-1.5 rounded-[18px] p-1.5 text-center transition-colors hover:bg-kapas"
        >
          <span className="grid size-12 place-items-center rounded-[16px] border-2 border-ink bg-mangga text-ink transition-transform duration-200 ease-pop group-hover:-translate-y-1">
            <LayoutGrid aria-hidden size={22} strokeWidth={2.25} />
          </span>
          <span className="text-label-sm leading-tight text-ink">{t.allBrands}</span>
          <span className="text-caption leading-none text-ink-soft">{plural(total, t.brandCount)}</span>
        </Link>
      </li>
    </ul>
  );
}

/** The three tier cops as links to the filtered directory (/brands?tier=…). */
export function TierLinks({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {TIERS.map((t) => (
        <li key={t.slug} data-tier={t.slug}>
          <Link
            href={`/brands?tier=${t.slug}`}
            onClick={onNavigate}
            data-tier-trigger=""
            className="cop min-h-9 !h-9 !px-3 transition-transform duration-150 hover:-rotate-2 active:scale-95"
          >
            <TierIcon tier={t.slug} size={18} />
            {t.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
