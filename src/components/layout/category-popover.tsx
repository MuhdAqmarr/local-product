import type { NavCategory } from "./nav-data";
import { CategoryTiles, TierLinks } from "./category-tiles";
import { KategoriTrigger } from "./kategori-trigger";

const ID = "kategori-popover";

/**
 * Desktop "Kategori ▾" (DESIGN §6.2): native `popover` panel, opens on click, Esc / outside click
 * closes. 11 categories + "Semua jenama" with brand counts, then the three tier cops.
 */
export function CategoryPopover({ categories }: { categories: NavCategory[] }) {
  return (
    <>
      <KategoriTrigger target={ID} />
      <div
        id={ID}
        popover="auto"
        role="dialog"
        aria-label="Kategori"
        className="pop-panel kategori-panel w-[min(560px,calc(100vw-48px))] overflow-hidden rounded-card-lg border-2 border-ink bg-putih p-0 text-ink shadow-float"
      >
        <div className="relative overflow-hidden border-b-2 border-garis bg-kapas px-5 py-3">
          <span aria-hidden className="songket" style={{ ["--pat-o" as string]: 0.18 }} />
          <p className="relative text-overline uppercase text-ink-soft">Rak kategori</p>
        </div>
        <div className="p-4">
          <CategoryTiles categories={categories} dense />
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t-2 border-dashed border-garis pt-4">
            <span className="text-label-sm text-ink-soft">Saiz jenama:</span>
            <TierLinks />
          </div>
        </div>
      </div>
    </>
  );
}
