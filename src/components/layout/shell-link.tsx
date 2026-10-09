"use client";

import type { ComponentProps } from "react";
import { Link } from "@/i18n/link";
import { useAfterLoad } from "@/lib/after-load";

type ShellLinkProps = Omit<ComponentProps<typeof Link>, "prefetch">;

/**
 * Locale-aware `next/link` for the header and tab bar (`href="/promos"` → "/ms/promos" on Malay
 * pages). These links are on screen on every page, so Next would prefetch all of them the moment
 * the page hydrates: 40–100 KB of RSC competing with the page's own first paint on a phone. They
 * keep the default (viewport) prefetch, but only once the first page has loaded and gone idle
 * (`useAfterLoad`).
 */
export function ShellLink(props: ShellLinkProps) {
  const afterLoad = useAfterLoad();
  return <Link {...props} prefetch={afterLoad ? null : false} />;
}
