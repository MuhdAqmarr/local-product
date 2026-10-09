import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Check } from "@/components/ui/lucide";
import { cn } from "@/lib/utils";

interface ChipBase {
  children: ReactNode;
  /** 18 px leading icon (lucide). Swapped for a popping Check when selected, so the width never changes. */
  icon?: ReactNode;
  /** Selected state (renders aria-pressed on buttons, aria-current on links). */
  selected?: boolean;
  /** Optional trailing count ("124"), Fredoka. */
  count?: number;
  /** Smaller 32 px chip for dense rows (hit area still 44 px). */
  dense?: boolean;
  className?: string;
}

type ChipAsButton = ChipBase & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { href?: undefined };
type ChipAsLink = ChipBase & { href: string; prefetch?: boolean; transitionTypes?: string[]; onClick?: () => void };
export type ChipProps = ChipAsButton | ChipAsLink;

/** Shared chip classes (DESIGN §6.5). Category colours come from the nearest `data-cat` (falls back to bandung-tint). */
export function chipClasses(selected?: boolean, dense?: boolean) {
  return cn(
    "group/chip relative inline-flex shrink-0 select-none items-center gap-2 rounded-full text-label text-ink [overflow-wrap:anywhere]",
    "transition-[background-color,transform] duration-150 ease-out-soft active:scale-[.94] active:duration-[90ms]",
    "before:absolute before:-inset-x-0.5 before:-inset-y-[2px] before:content-['']",
    dense ? "h-8 pl-2 pr-3 before:-inset-y-1.5" : "h-10 pl-2.5 pr-3.5",
    selected
      ? "border-2 border-ink bg-[color:var(--cat-tint,var(--color-bandung-tint))] shadow-pop-sm"
      : "border-[1.5px] border-garis-kuat bg-putih [@media(hover:hover)]:hover:bg-kapas",
  );
}

function ChipInner({ icon, selected, children, count }: Pick<ChipBase, "icon" | "selected" | "children" | "count">) {
  return (
    <>
      {icon || selected ? (
        <span aria-hidden className="grid size-[18px] shrink-0 place-items-center text-[color:var(--cat-ink,var(--color-ink))] [&>svg]:size-[18px]">
          {selected ? <Check strokeWidth={2.5} className="animate-pop-in" /> : icon}
        </span>
      ) : null}
      <span className="leading-tight">{children}</span>
      {count != null && <span className="font-num text-[13px] text-ink-soft">{count}</span>}
    </>
  );
}

/** Pill chip: `<button aria-pressed>` toggle or a `Link` (filter shortcuts). Use inside client components for onClick. */
export function Chip(props: ChipProps) {
  const { children, icon, selected, count, dense, className } = props;
  const cls = cn(chipClasses(selected, dense), className);
  if (props.href !== undefined) {
    const { href, prefetch, transitionTypes, onClick } = props;
    return (
      <Link href={href} prefetch={prefetch} transitionTypes={transitionTypes} onClick={onClick} aria-current={selected ? "true" : undefined} className={cls}>
        <ChipInner icon={icon} selected={selected} count={count}>
          {children}
        </ChipInner>
      </Link>
    );
  }
  const { children: _c, icon: _i, selected: _s, count: _n, dense: _d, className: _cl, type = "button", ...rest } = props;
  void _c; void _i; void _s; void _n; void _d; void _cl;
  return (
    <button type={type} aria-pressed={selected ?? false} className={cls} {...rest}>
      <ChipInner icon={icon} selected={selected} count={count}>
        {children}
      </ChipInner>
    </button>
  );
}
