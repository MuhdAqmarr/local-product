"use client";

import { useLinkStatus } from "next/link";
import { ShellLink } from "./shell-link";
import type { ReactNode } from "react";
import { Squiggle } from "@/components/art/squiggle";
import { useLocalePath } from "@/i18n/client";
import { cn } from "@/lib/utils";

/**
 * True when `pathname` is `href` or a child of it ("/brands" matches "/brands/x"). "/" matches only itself.
 * Compare language-neutral paths: pass `useLocalePath()`, not `usePathname()`.
 */
export function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Three 4 px dots. The fixed-width box is always rendered (no layout shift); the dots, and their
 *  infinite bounce animation, exist only while the link is pending (QA F08). */
export function PendingDots({ className }: { className?: string }) {
  const { pending } = useLinkStatus();
  return (
    <span aria-hidden className={cn("dots inline-flex items-center transition-opacity duration-150 [&>i]:size-1", pending ? "opacity-100" : "opacity-0", className)}>
      {pending && (
        <>
          <i />
          <i />
          <i />
        </>
      )}
    </span>
  );
}

/** The squiggle underline: always visible when active, draws in (scaleX from the left) on hover. */
export function NavSquiggle({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 -bottom-1.5 origin-left transition-transform duration-200 ease-out-soft",
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
      )}
    >
      <Squiggle height={8} />
    </span>
  );
}

/** Desktop header nav item: ink label, pink squiggle when active, pending dots after the label. `href` is language-neutral. */
export function NavLink({ href, children, badge }: { href: string; children: ReactNode; badge?: ReactNode }) {
  const pathname = useLocalePath();
  const active = isActivePath(pathname, href);
  return (
    <ShellLink
      href={href}
      aria-current={active ? "page" : undefined}
      transitionTypes={["nav-tab"]}
      className="group relative inline-flex h-11 items-center gap-1.5 rounded-full px-1 text-[15px] font-semibold text-ink"
    >
      <span className="relative">
        {children}
        <NavSquiggle active={active} />
      </span>
      {badge}
      <PendingDots className="w-[18px]" />
    </ShellLink>
  );
}
