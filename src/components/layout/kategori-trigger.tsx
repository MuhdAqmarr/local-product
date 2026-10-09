"use client";

import { usePathname } from "next/navigation";
import { ChevronDown } from "@/components/ui/lucide";
import { NavSquiggle } from "./nav-link";

/** Desktop "Kategori ▾" button: opens the native popover; squiggle when browsing a category. */
export function KategoriTrigger({ target }: { target: string }) {
  const pathname = usePathname();
  const active = Boolean(pathname?.startsWith("/categories/"));
  return (
    <button
      type="button"
      popoverTarget={target}
      className="kategori-trigger group relative inline-flex h-11 items-center gap-1 rounded-full px-1 text-[15px] font-semibold text-ink"
      style={{ ["anchorName" as string]: `--${target}` }}
    >
      <span className="relative">
        Kategori
        <NavSquiggle active={active} />
      </span>
      <ChevronDown aria-hidden size={18} strokeWidth={2.25} className="kategori-chev transition-transform duration-200" />
    </button>
  );
}
