import { Link } from "@/i18n/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * A link whose ::after covers the nearest `position: relative` ancestor (the whole card).
 * Put other interactive bits (heart, brand link) above it with `relative z-10`.
 * `external` opens the store in a new tab with rel="noopener noreferrer".
 */
export function StretchedLink({ className, external, href, ...rest }: Omit<ComponentProps<typeof Link>, "href"> & { href: string; external?: boolean }) {
  if (external) {
    const { prefetch: _p, transitionTypes: _t, replace: _r, scroll: _s, onNavigate: _n, ...anchor } = rest;
    void _p; void _t; void _r; void _s; void _n;
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cn("stretched-link", className)} {...anchor} />;
  }
  return <Link href={href} className={cn("stretched-link", className)} {...rest} />;
}
