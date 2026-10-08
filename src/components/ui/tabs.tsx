"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import * as m from "motion/react-m";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface TabItem<V extends string = string> {
  value: V;
  label: ReactNode;
  /** Shown as "(n)" after the label. */
  count?: number;
  icon?: ReactNode;
}

export const tabId = (base: string, value: string) => `${base}-tab-${value}`;
export const panelId = (base: string, value: string) => `${base}-panel-${value}`;

export interface TabsProps<V extends string = string> {
  /** Prefix for tab/panel ids. Panels must use `id={panelId(base, value)}` and `aria-labelledby={tabId(base, value)}`. */
  base: string;
  items: readonly TabItem<V>[];
  value: V;
  onChange: (value: V) => void;
  label: string;
  className?: string;
}

/**
 * Tablist with the segmented look (DESIGN §6.17). Panels are rendered by the caller (server-rendered,
 * toggled with `hidden`); give panels `className="tab-panel"` for the 160 ms @starting-style fade.
 */
export function Tabs<V extends string>({ base, items, value, onChange, label, className }: TabsProps<V>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const index = Math.max(0, items.findIndex((t) => t.value === value));
  const n = items.length;

  const onKeyDown = (event: KeyboardEvent) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % n;
    else if (event.key === "ArrowLeft") next = (index - 1 + n) % n;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = n - 1;
    else return;
    event.preventDefault();
    onChange(items[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className={cn("relative grid h-11 grid-flow-col auto-cols-fr rounded-full bg-kapas p-1", className)}>
      <m.span
        aria-hidden
        className="pointer-events-none absolute bottom-1 left-1 top-1 rounded-full border-[1.5px] border-ink bg-putih shadow-pop-sm"
        style={{ width: `calc((100% - 8px) / ${n})` }}
        initial={false}
        animate={{ x: `${index * 100}%` }}
        transition={spring.snappy}
      />
      {items.map((t, i) => {
        const active = i === index;
        return (
          <button
            key={t.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={tabId(base, t.value)}
            aria-controls={panelId(base, t.value)}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.value)}
            className={cn(
              "relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full px-3 text-label transition-colors duration-150 [&>svg]:size-[18px]",
              active ? "text-ink" : "text-ink-soft hover:text-ink",
            )}
          >
            {t.icon}
            {t.label}
            {t.count != null && <span className="font-num text-[13px]">({t.count})</span>}
          </button>
        );
      })}
    </div>
  );
}
