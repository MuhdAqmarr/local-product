import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { popStyle } from "./pop";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Accessible name (required; icon-only). */
  label: string;
  icon: ReactNode;
  /** 44 (default) or 40 / 36 visual size; the hit area is always ≥ 44 px. */
  size?: 44 | 40 | 36;
  /** "pop" = putih circle, 2 px ink, 2 px ink shadow. "plain" = no outline (on busy surfaces). */
  variant?: "pop" | "plain";
  href?: string;
  /** Extra classes for the face. */
  faceClassName?: string;
}

/** 44 px sticker-solid icon button (DESIGN §6.16 "Icon"). Renders a Link when `href` is set. */
export function IconButton({ label, icon, size = 44, variant = "pop", href, className, faceClassName, type = "button", ...rest }: IconButtonProps) {
  const dim = size === 44 ? "size-11" : size === 40 ? "size-10" : "size-9";
  const hit = size < 44 ? "after:absolute after:-inset-1 after:content-['']" : "";
  const face =
    variant === "pop" ? (
      <span className={cn("pop-face bg-putih text-ink [&>svg]:size-5", dim, faceClassName)}>{icon}</span>
    ) : (
      <span className={cn("grid place-items-center rounded-full text-ink transition-colors hover:bg-kapas [&>svg]:size-6", dim, faceClassName)}>{icon}</span>
    );
  const cls = cn(variant === "pop" ? "pop" : "inline-grid rounded-full", "relative shrink-0", hit, className);
  const style = variant === "pop" ? popStyle({ offset: 2 }) : undefined;
  if (href)
    return (
      <Link href={href} aria-label={label} className={cls} style={style}>
        {face}
      </Link>
    );
  return (
    <button type={type} aria-label={label} className={cls} style={style} {...rest}>
      {face}
    </button>
  );
}
