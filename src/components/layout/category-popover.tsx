import { getDictionary, getLocale } from "@/i18n/server";
import type { NavCategory } from "./nav-data";
import { CategoryTiles, TierLinks } from "./category-tiles";
import { KategoriTrigger } from "./kategori-trigger";
import { PopoverAutoClose } from "./popover-auto-close";

const ID = "kategori-popover";

/**
 * Desktop "Kategori ▾" (DESIGN §6.2): native `popover` panel, opens on click; Esc, outside click
 * or picking a link closes it. 11 categories + "All brands" with brand counts, then the three tier cops.
 */
export async function CategoryPopover({ categories }: { categories: NavCategory[] }) {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  const k = t.common.kategori;
  return (
    <>
      <KategoriTrigger target={ID} />
      <PopoverAutoClose id={ID} />
      <div
        id={ID}
        popover="auto"
        role="dialog"
        aria-label={k.button}
        className="pop-panel kategori-panel w-[min(560px,calc(100vw-48px))] overflow-hidden rounded-card-lg border-2 border-ink bg-putih p-0 text-ink shadow-float"
      >
        <div className="relative overflow-hidden border-b-2 border-garis bg-kapas px-5 py-3">
          <span aria-hidden className="songket" style={{ ["--pat-o" as string]: 0.18 }} />
          <p className="relative text-overline uppercase text-ink-soft">{k.panelTitle}</p>
        </div>
        <div className="p-4">
          <CategoryTiles categories={categories} locale={locale} dense />
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t-2 border-dashed border-garis pt-4">
            <span className="text-label-sm text-ink-soft">{k.brandSizeLabel}</span>
            <TierLinks />
          </div>
        </div>
      </div>
    </>
  );
}
