"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import * as m from "motion/react-m";
import { BadgePercent, Heart, House, Sparkles, type LucideIcon } from "lucide-react";
import { SearchTrigger } from "@/components/search/search-trigger";
import { CountBubble } from "@/components/ui/count-bubble";
import { useSaved } from "@/lib/saved";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { isActivePath } from "./nav-link";

interface Slot {
  href: string;
  label: string;
  icon: LucideIcon;
  slot: number;
}

const SLOTS: Slot[] = [
  { href: "/", label: "Utama", icon: House, slot: 0 },
  { href: "/promos", label: "Promo", icon: BadgePercent, slot: 1 },
  { href: "/new", label: "Baru", icon: Sparkles, slot: 3 },
  { href: "/saved", label: "Simpan", icon: Heart, slot: 4 },
];

function TabDots() {
  const { pending } = useLinkStatus();
  return (
    <span aria-hidden className={cn("dots absolute -bottom-0.5 left-1/2 inline-flex -translate-x-1/2 transition-opacity duration-150 [&>i]:size-1", pending ? "opacity-100" : "opacity-0")}>
      <i />
      <i />
      <i />
    </span>
  );
}

/**
 * Bottom tab bar (< 1024 px, DESIGN §6.3): Utama · Promo · ( Cari ) · Baru · Simpan.
 * One bandung-tint pill slides between the four link slots with `translateX` (equal widths,
 * spring.snappy, no layoutId). Promo shows the live promo count; Simpan is the fly-to target.
 */
export function TabBar({ promoCount }: { promoCount: number }) {
  const pathname = usePathname();
  const { count: savedCount } = useSaved();
  const active = SLOTS.find((s) => isActivePath(pathname, s.href));

  return (
    <nav
      aria-label="Navigasi utama"
      style={{ viewTransitionName: "tab-bar" }}
      className="fixed inset-x-0 bottom-0 z-(--z-header) rounded-t-[24px] border-t-2 border-ink bg-putih/96 pb-[env(safe-area-inset-bottom)] shadow-up lg:hidden"
    >
      <div className="relative mx-auto grid h-16 max-w-[560px] grid-cols-5">
        {/* Sliding active pill: one element, moved by whole slots. */}
        <m.span
          aria-hidden
          className="pointer-events-none absolute left-0 top-2 flex w-1/5 justify-center"
          initial={false}
          animate={{ x: `${(active?.slot ?? 0) * 100}%`, opacity: active ? 1 : 0 }}
          transition={spring.snappy}
        >
          <span className="h-8 w-[52px] rounded-full border-[1.5px] border-ink bg-bandung-tint" />
        </m.span>

        {SLOTS.slice(0, 2).map((s) => (
          <TabLink key={s.href} slot={s} active={active === s} badge={s.href === "/promos" ? promoCount : 0} />
        ))}
        <SearchTrigger variant="tab" />
        {SLOTS.slice(2).map((s) => (
          <TabLink key={s.href} slot={s} active={active === s} badge={s.href === "/saved" ? savedCount : 0} saved={s.href === "/saved"} />
        ))}
      </div>
    </nav>
  );
}

function TabLink({ slot, active, badge, saved }: { slot: Slot; active: boolean; badge: number; saved?: boolean }) {
  const Icon = slot.icon;
  const name = badge > 0 ? `${slot.label}, ${badge} item` : slot.label;
  return (
    <Link
      href={slot.href}
      aria-label={name}
      aria-current={active ? "page" : undefined}
      transitionTypes={["nav-tab"]}
      data-saved-target={saved ? "" : undefined}
      className="relative flex flex-col items-center justify-start gap-1 pt-2 active:[&>span:first-child]:scale-90"
    >
      <span className="relative grid h-8 w-[52px] place-items-center transition-transform duration-[90ms]">
        <Icon aria-hidden size={24} strokeWidth={2.25} className={cn(active ? "text-ink" : "text-ink-soft", active && saved && "fill-bandung")} />
        <CountBubble count={badge} className="absolute -top-1 right-0.5" />
        <TabDots />
      </span>
      <span aria-hidden className={cn("text-tab", active ? "text-ink" : "text-ink-soft")}>
        {slot.label}
      </span>
    </Link>
  );
}
