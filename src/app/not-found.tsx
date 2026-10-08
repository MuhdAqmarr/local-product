import type { Metadata } from "next";
import { BadgePercent, LayoutGrid, Sparkles, Store } from "lucide-react";
import { ErrorFrame } from "@/components/feedback/error-frame";
import { CategoryTiles } from "@/components/layout/category-tiles";
import { SearchTrigger } from "@/components/search/search-trigger";
import { Button } from "@/components/ui/button";
import { Chip, chipClasses } from "@/components/ui/chip";
import { PopoverPanel, PopoverTrigger } from "@/components/ui/popover";
import { brandsInCategory } from "@/lib/brands";
import { CATEGORIES } from "@/lib/taxonomy";

export const metadata: Metadata = { title: "Rak kosong", robots: { index: false } };

const CHIPS = [
  { href: "/promos", label: "Promo", icon: <BadgePercent /> },
  { href: "/new", label: "Baru", icon: <Sparkles /> },
  { href: "/brands", label: "Jenama", icon: <Store /> },
];

const NAV_CATEGORIES = CATEGORIES.map((c) => ({ slug: c.slug, nameMs: c.nameMs, brands: brandsInCategory(c.slug).length, promos: 0 }));

/** 404 (DESIGN §8.10, copy §9.7): empty rak + sleeping Oyen + cut-string wau, search, shortcuts. */
export default function NotFound() {
  return (
    <ErrorFrame
      mood="tidur"
      title="Alamak, rak ni kosong!"
      body="Page yang kau cari dah habis stok, atau memang tak pernah wujud. Oyen pun tertidur menunggu."
    >
      <Button href="/" variant="primary" trailing="arrow" transitionTypes={["nav-back"]}>
        Balik ke kedai
      </Button>
      <SearchTrigger variant="pill" className="w-full max-w-[320px] sm:w-[300px]" />
      <ul className="flex w-full flex-wrap justify-center gap-2 md:justify-start" aria-label="Pintasan">
        {CHIPS.map((c) => (
          <li key={c.label}>
            <Chip href={c.href} icon={c.icon}>
              {c.label}
            </Chip>
          </li>
        ))}
        <li>
          <PopoverTrigger target="nf-kategori" aria-haspopup="dialog" className={chipClasses()}>
            <span aria-hidden="true" className="grid size-[18px] place-items-center [&>svg]:size-[18px]">
              <LayoutGrid />
            </span>
            <span className="leading-tight">Kategori</span>
          </PopoverTrigger>
          <PopoverPanel id="nf-kategori" label="Kategori" align="center" className="w-[min(380px,calc(100vw-32px))]">
            <CategoryTiles categories={NAV_CATEGORIES} />
          </PopoverPanel>
        </li>
      </ul>
    </ErrorFrame>
  );
}
