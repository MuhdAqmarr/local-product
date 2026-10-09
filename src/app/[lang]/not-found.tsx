import type { Metadata } from "next";
import { BadgePercent, LayoutGrid, Sparkles, Store } from "@/components/ui/lucide";
import { ErrorFrame } from "@/components/feedback/error-frame";
import { CategoryTiles } from "@/components/layout/category-tiles";
import { SearchTrigger } from "@/components/search/search-trigger";
import { Button } from "@/components/ui/button";
import { Chip, chipClasses } from "@/components/ui/chip";
import { PopoverPanel, PopoverTrigger } from "@/components/ui/popover";
import enErrors from "@/i18n/dictionaries/en/errors";
import msErrors from "@/i18n/dictionaries/ms/errors";
import { getDictionary, getLocale } from "@/i18n/server";
import { brandsInCategory } from "@/lib/brands";
import { CATEGORIES, categoryLabel } from "@/lib/taxonomy";

// Fallback title only: the [...missing] catch-all sets the localized one for proxy-rewritten 404s.
// No canonical/hreflang (the layout's home-page alternates would otherwise leak onto every 404).
export const metadata: Metadata = { title: `${enErrors.notFound.metaTitle} · ${msErrors.notFound.metaTitle}`, robots: { index: false }, alternates: null };

/** 404 (DESIGN §8.10, copy §9.7): empty rak + sleeping Oyen + cut-string wau, search, shortcuts. */
export default async function NotFound() {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  const e = t.errors.notFound;
  const nav = t.common.nav;
  const chips = [
    { href: "/promos", label: nav.promos, icon: <BadgePercent /> },
    { href: "/new", label: nav.new, icon: <Sparkles /> },
    { href: "/brands", label: nav.brands, icon: <Store /> },
  ];
  const categories = CATEGORIES.map((c) => ({ slug: c.slug, label: categoryLabel(c, locale), brands: brandsInCategory(c.slug).length, promos: 0 }));

  return (
    <ErrorFrame mood="tidur" title={e.title} body={e.body}>
      <Button href="/" variant="primary" trailing="arrow" transitionTypes={["nav-back"]}>
        {e.home}
      </Button>
      <SearchTrigger variant="pill" className="w-full max-w-[320px] sm:w-[300px]" />
      <ul className="flex w-full flex-wrap justify-center gap-2 md:justify-start" aria-label={e.shortcuts}>
        {chips.map((c) => (
          <li key={c.href}>
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
            <span className="leading-tight">{e.categories}</span>
          </PopoverTrigger>
          <PopoverPanel id="nf-kategori" label={e.categories} align="center" className="w-[min(380px,calc(100vw-32px))]">
            <CategoryTiles categories={categories} locale={locale} />
          </PopoverPanel>
        </li>
      </ul>
    </ErrorFrame>
  );
}
