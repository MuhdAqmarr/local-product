"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import * as m from "motion/react-m";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface SegmentOption<V extends string = string> {
  value: V;
  label: ReactNode;
  /** 18 px icon before the label (e.g. tier icon). */
  icon?: ReactNode;
  /** Accessible label when `label` is not plain text. */
  ariaLabel?: string;
}

export interface SegmentedProps<V extends string = string> {
  options: readonly SegmentOption<V>[];
  value: V;
  onChange: (value: V) => void;
  /** Accessible name of the radiogroup ("Saiz jenama"). */
  label: string;
  className?: string;
  /** Compact h-9 version for toolbars. */
  size?: "md" | "sm";
  /**
   * `equal` (default): equal cells that truncate their labels. `content`: equal cells that never
   * shrink below their label (`auto-cols-[1fr]`); give the control room (e.g. `w-max min-w-[540px]`).
   */
  fit?: "equal" | "content";
  /** Below 640 px: hide the icons and let labels wrap to two centred lines (full tier names fit). */
  wrap?: boolean;
}

/**
 * Segmented control (DESIGN §6.17): kapas track, one thumb that slides with `translateX(i × 100%)`
 * (equal-width cells, no layout animation). role="radiogroup" with arrow-key roving focus.
 */
export function Segmented<V extends string>({ options, value, onChange, label, className, size = "md", fit = "equal", wrap }: SegmentedProps<V>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const n = options.length;

  const onKeyDown = (event: KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next = index;
    if (event.key in keys) next = (index + keys[event.key] + n) % n;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = n - 1;
    else return;
    event.preventDefault();
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        "relative grid grid-flow-col rounded-full bg-kapas p-1",
        fit === "content" ? "auto-cols-[1fr]" : "auto-cols-fr",
        size === "md" ? "h-11" : "h-9",
        className,
      )}
    >
      <m.span
        aria-hidden
        className="pointer-events-none absolute bottom-1 left-1 top-1 rounded-full border-[1.5px] border-ink bg-putih shadow-pop-sm"
        style={{ width: `calc((100% - 8px) / ${n})` }}
        initial={false}
        animate={{ x: `${index * 100}%` }}
        transition={spring.snappy}
      />
      {options.map((o, i) => {
        const active = i === index;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.ariaLabel}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative z-10 inline-flex min-w-0 items-center justify-center gap-1.5 rounded-full px-2 text-label transition-colors duration-150 [&>svg]:size-[18px]",
              active ? "text-ink" : "text-ink-soft hover:text-ink",
              size === "sm" && "text-[13px]",
              wrap && "max-sm:px-1 max-sm:[&>svg]:hidden",
            )}
          >
            {o.icon}
            <span
              className={cn(
                fit === "content" ? "whitespace-nowrap" : "truncate",
                wrap && "max-sm:line-clamp-2 max-sm:text-center max-sm:text-label-sm max-sm:leading-[1.1] max-sm:whitespace-normal",
              )}
            >
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
