import Link from "next/link";
import { Store } from "lucide-react";
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

/**
 * Site header (DESIGN §6.2). One sticky element (`#site-header`, VT name "site-header"):
 * awning (20 / 26 px) + bar (56 / 72 px) on solid santan/96 (no blur). Mobile: logo · Jenama pill ·
 * Kategori sheet. Desktop: logo · nav (Promo · Baru · Jenama · Kategori ▾ · Tentang) · search pill · Simpan.
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

          <nav aria-label="Navigasi utama desktop" className="ml-8 hidden items-center gap-6 lg:flex">
            <NavLink href="/promos" badge={<CountBubble count={promoCount} />}>
              Promo
            </NavLink>
            <NavLink href="/new">Baru</NavLink>
            <NavLink href="/brands">Jenama</NavLink>
            <CategoryPopover categories={categories} />
            <NavLink href="/about">Tentang</NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-2.5 lg:hidden">
            <Link href="/brands" transitionTypes={["nav-tab"]} className="pop" style={popStyle({ offset: 2 })}>
              <span className="pop-face h-10 gap-1.5 bg-putih px-3.5 text-label text-ink">
                <Store aria-hidden size={18} strokeWidth={2.25} />
                Jenama
              </span>
            </Link>
            <CategorySheet categories={categories} />
          </div>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <SearchTrigger variant="pill" className="w-[260px] xl:w-[300px]" />
            <SavedLink />
          </div>
        </div>
        <span aria-hidden className="header-hairline absolute inset-x-0 bottom-0 h-0.5 bg-garis" />
      </div>
      <HeaderScroll />
    </header>
  );
}
