"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, type ComponentProps } from "react";

type BrandLinkProps = Omit<ComponentProps<typeof Link>, "href" | "prefetch"> & { href: string };

/**
 * Link for dense brand grids (QA F06): no viewport prefetch (each static brand page is 14–42 KB of
 * RSC), prefetch on intent instead (pointer enter, touch start, focus). Skipped under Save-Data.
 */
export function BrandLink({ href, onPointerEnter, onTouchStart, onFocus, ...rest }: BrandLinkProps) {
  const router = useRouter();
  const done = useRef(false);
  const warm = () => {
    if (done.current) return;
    done.current = true;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    router.prefetch(href);
  };
  return (
    <Link
      {...rest}
      href={href}
      prefetch={false}
      onPointerEnter={(e) => {
        warm();
        onPointerEnter?.(e);
      }}
      onTouchStart={(e) => {
        warm();
        onTouchStart?.(e);
      }}
      onFocus={(e) => {
        warm();
        onFocus?.(e);
      }}
    />
  );
}
