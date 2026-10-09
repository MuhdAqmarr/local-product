"use client";

import { Link } from "@/i18n/link";
import { useState } from "react";
import { ArrowRight, Info, LayoutGrid, Megaphone, Store } from "@/components/ui/lucide";
import { Sheet } from "@/components/ui/sheet";
import { IconButton } from "@/components/ui/icon-button";
import { CategoryTiles, TierLinks } from "./category-tiles";
import { useI18n } from "@/i18n/client";
import type { CommonMessages } from "@/i18n/dictionaries/en/common";
import { MotionToggle } from "./motion-toggle";
import type { NavCategory } from "./nav-data";

const LINKS = [
  { href: "/brands", label: "allBrands", icon: Store },
  { href: "/about", label: "aboutLink", icon: Info },
  { href: "/about#cadang", label: "suggestLink", icon: Megaphone },
] as const satisfies ReadonlyArray<{ href: string; label: keyof CommonMessages["kategori"]; icon: unknown }>;

/**
 * Mobile Kategori sheet (DESIGN §6.2): tiles → tier cops → links → reduce-motion switch.
 * The body renders on first open (then stays for the close animation), so the closed sheet adds
 * no markup to every page.
 */
export function CategorySheet({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const show = () => {
    setOpened(true);
    setOpen(true);
  };
  const close = () => setOpen(false);
  const { m } = useI18n();
  const k = m.common.kategori;
  return (
    <>
      <IconButton label={k.button} icon={<LayoutGrid strokeWidth={2.25} />} onClick={show} aria-haspopup="dialog" aria-expanded={open} />
      <Sheet open={open} onClose={close} title={k.sheetTitle} description={k.sheetDescription} id="kategori-sheet">
        {opened && <SheetBody categories={categories} onNavigate={close} />}
      </Sheet>
    </>
  );
}

function SheetBody({ categories, onNavigate }: { categories: NavCategory[]; onNavigate: () => void }) {
  const { m, locale } = useI18n();
  const k = m.common.kategori;
  return (
    <>
      <CategoryTiles categories={categories} locale={locale} onNavigate={onNavigate} />
      <h3 className="mb-2 mt-6 text-overline uppercase text-ink-soft">{k.brandSize}</h3>
      <TierLinks onNavigate={onNavigate} />
      <ul className="mt-6 divide-y-2 divide-garis border-y-2 border-garis">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link href={href} onClick={onNavigate} className="group flex min-h-12 items-center gap-3 py-2 text-label text-ink">
              <Icon aria-hidden size={20} strokeWidth={2} className="text-ink-soft" />
              <span className="flex-1">{k[label]}</span>
              <ArrowRight aria-hidden size={18} className="text-ink-soft transition-transform duration-200 group-hover:translate-x-[3px]" />
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-5 rounded-card bg-kapas p-4">
        <MotionToggle variant="switch" />
      </div>
    </>
  );
}
