import { Store } from "@/components/ui/lucide";
import { getCategorySummaries } from "@/lib/catalog";
import { CATEGORY_BY_SLUG } from "@/lib/taxonomy";
import { SearchTrigger } from "@/components/search/search-trigger";
import { CountBubble } from "@/components/ui/count-bubble";
import { popStyle } from "@/components/ui/pop";
import { Awning } from "./awning";
import { CategoryPopover } from "./category-popover";
import { CategorySheet } from "./category-sheet";
import { HeaderScroll } from "./header-scroll";
import { Logo } from "./logo";
import type { NavCategory } from "./nav-data";
import { NavLink } from "./nav-link";
import { SavedLink } from "./saved-link";
import { ShellLink } from "./shell-link";

/**
 * Site header (DESIGN §6.2). One sticky element (`#site-header`, VT name "site-header"):
 * awning (20 / 26 px) + bar (56 / 72 px) on solid santan/96 (no blur). Mobile: logo · Jenama pill ·
 * Kategori sheet. Desktop: logo · nav (Promo · Baru · Jenama · Kategori ▾ · Tentang) · search pill · Simpan.
 * The pill is fluid (≤ 300 px) and the nav tightens below xl so 1024–1279 px never scrolls sideways.
 */
export async function SiteHeader({ promoCount }: { promoCount: number }) {
  const summaries = await getCategorySummaries();
  const categories: NavCategory[] = summaries.map((c) => ({
    slug: c.slug,
    nameMs: CATEGORY_BY_SLUG[c.slug].nameMs,
    brands: c.brands,
    promos: c.promos,
  }));

  return (
    <header id="site-header" className="site-header sticky top-0 z-(--z-header)" style={{ viewTransitionName: "site-header" }}>
      <Awning />
      <div className="relative bg-santan/98">
        <div className="container-page flex h-(--header-h) items-center gap-3">
          <Logo />

          <nav aria-label="Navigasi utama desktop" className="ml-6 hidden shrink-0 items-center gap-3 lg:flex xl:ml-8 xl:gap-6">
            <NavLink href="/promos" badge={<CountBubble count={promoCount} />}>
              Promo
            </NavLink>
            <NavLink href="/new">Baru</NavLink>
            <NavLink href="/brands">Jenama</NavLink>
            <CategoryPopover categories={categories} />
            <NavLink href="/about">Tentang</NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-2.5 lg:hidden">
            <ShellLink href="/brands" transitionTypes={["nav-tab"]} className="pop" style={popStyle({ offset: 2 })}>
              <span className="pop-face h-10 gap-1.5 bg-putih px-3.5 text-label text-ink">
                <Store aria-hidden size={18} strokeWidth={2.25} />
                Jenama
              </span>
            </ShellLink>
            <CategorySheet categories={categories} />
          </div>

          <div className="ml-auto hidden min-w-0 flex-1 items-center justify-end gap-3 lg:flex">
            <SearchTrigger variant="pill" className="w-auto min-w-0 max-w-[300px] flex-1 shrink" />
            <SavedLink />
          </div>
        </div>
        <span aria-hidden className="header-hairline absolute inset-x-0 bottom-0 h-0.5 bg-garis" />
      </div>
      <HeaderScroll />
    </header>
  );
}
