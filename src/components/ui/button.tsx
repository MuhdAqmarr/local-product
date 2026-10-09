import { Link } from "@/i18n/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/ui/lucide";
import { cn } from "@/lib/utils";
import { popStyle } from "./pop";

export type ButtonVariant = "primary" | "secondary" | "outbound" | "soft" | "ghost" | "danger";
export type ButtonSize = "lg" | "md" | "sm";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading icon (20 px lucide). */
  icon?: ReactNode;
  /** Trailing icon. "arrow" = ArrowRight (nudges +3 px), "outbound" = ArrowUpRight (nudges up-right). */
  trailing?: ReactNode | "arrow" | "outbound";
  /** Keeps the label, swaps the icon for bouncing dots, locks width, sets aria-busy. */
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  /** Extra classes for the face (pop variants) or the root (soft/ghost). */
  faceClassName?: string;
  children: ReactNode;
}

type AsButton = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { href?: undefined };
type AsLink = BaseProps & Omit<ComponentProps<typeof Link>, keyof BaseProps | "href"> & { href: string; external?: false };
type AsExternal = BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps | "href"> & { href: string; external: true };
export type ButtonProps = AsButton | AsLink | AsExternal;

const SIZE: Record<ButtonSize, string> = {
  lg: "h-14 px-7 text-[16px] font-semibold leading-none",
  md: "h-12 px-[22px] text-button",
  sm: "h-10 px-4 text-[14px] font-semibold leading-none",
};

const POP_FACE: Partial<Record<ButtonVariant, string>> = {
  primary: "bg-bandung text-ink",
  secondary: "bg-putih text-ink",
  outbound: "bg-ink text-santan",
  danger: "bg-sambal-pekat text-white",
};

export function Dots({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("dots inline-flex items-center", className)}>
      <i />
      <i />
      <i />
    </span>
  );
}

function Trailing({ trailing }: { trailing: BaseProps["trailing"] }) {
  if (trailing === "arrow")
    return <ArrowRight aria-hidden size={20} strokeWidth={2} className="shrink-0 transition-transform duration-200 ease-out-soft group-hover:translate-x-[3px]" />;
  if (trailing === "outbound")
    return (
      <ArrowUpRight aria-hidden size={20} strokeWidth={2} className="shrink-0 transition-transform duration-200 ease-out-soft group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
    );
  return <>{trailing}</>;
}

/** Shared class builder, for elements that cannot use <Button> (e.g. a <summary> or a form submit inside a client lib). */
export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md") {
  const isPop = variant in POP_FACE;
  return {
    root: isPop ? "pop group" : "group",
    face: isPop
      ? cn("pop-face relative overflow-hidden whitespace-nowrap", SIZE[size], POP_FACE[variant])
      : variant === "soft"
        ? cn("inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-ink bg-bandung-tint text-ink whitespace-nowrap", SIZE[size])
        : cn("inline-flex items-center justify-center gap-1.5 rounded-full text-telang whitespace-nowrap", SIZE[size], "px-2"),
  };
}

/**
 * Candy button (DESIGN §6.16). Pop variants (primary, secondary, outbound ink, danger) press *into*
 * their hard shadow; soft and ghost are flat. Renders a <button>, a next/link <Link> (href) or an
 * external <a target=_blank> (href + external). One primary per view.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", icon, trailing, loading, fullWidth, className, faceClassName, children, ...rest } = props;
  const isPop = variant in POP_FACE;
  const cls = buttonClasses(variant, size);
  const disabled = "disabled" in rest && rest.disabled;

  const inner = (
    <>
      {variant === "primary" && (
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-bandung-fizz opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      )}
      {loading ? <Dots className="relative" /> : icon ? <span className="relative inline-flex shrink-0 [&>svg]:size-5">{icon}</span> : null}
      <span className={cn("relative", variant === "ghost" && "relative")}>
        {children}
        {variant === "ghost" && (
          <svg
            aria-hidden
            viewBox="0 0 104 12"
            preserveAspectRatio="none"
            className="pointer-events-none absolute -bottom-2 left-0 h-2 w-full origin-left scale-x-0 transition-transform duration-200 ease-out-soft group-hover:scale-x-100 group-focus-visible:scale-x-100"
          >
            <path d="M2 8Q12 0 22 8T42 8T62 8T82 8T102 8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
        )}
      </span>
      {!loading && trailing ? (
        <span className="relative inline-flex">
          <Trailing trailing={trailing} />
        </span>
      ) : null}
    </>
  );

  const face = <span className={cn(cls.face, fullWidth && "w-full", disabled && isPop && "border-garis bg-kapas text-ink-soft", faceClassName)}>{inner}</span>;

  const rootClass = cn(
    isPop ? "pop group" : "group inline-flex",
    fullWidth && "flex w-full",
    size === "sm" && "relative after:absolute after:inset-x-0 after:-inset-y-[2px] after:content-['']",
    "disabled:cursor-not-allowed",
    className,
  );
  const style = isPop ? popStyle({ offset: size === "sm" ? 2 : 4, color: variant === "outbound" ? "var(--color-bandung)" : undefined }) : undefined;

  if (rest.href !== undefined) {
    if ("external" in rest && rest.external) {
      const { external: _external, href, ...anchor } = rest;
      void _external;
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={rootClass} style={style} aria-busy={loading || undefined} {...anchor}>
          {face}
        </a>
      );
    }
    const { href, external: _e, ...link } = rest as AsLink;
    void _e;
    return (
      <Link href={href} className={rootClass} style={style} aria-busy={loading || undefined} {...link}>
        {face}
      </Link>
    );
  }

  const { type = "button", ...button } = rest as AsButton;
  return (
    <button type={type} className={rootClass} style={style} aria-busy={loading || undefined} aria-disabled={disabled || undefined} {...button}>
      {face}
    </button>
  );
}
