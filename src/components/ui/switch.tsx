"use client";

import { useId, type ReactNode } from "react";
import * as m from "motion/react-m";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Visible label (rendered next to the track and used as the accessible name). */
  label?: ReactNode;
  /** Accessible name when there is no visible label. */
  "aria-label"?: string;
  /** Optional helper line under the label. */
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
  /** Put the label after the track (default before, label left / track right). */
  labelAfter?: boolean;
  /** Use on ink surfaces (footer): santan label. */
  onInk?: boolean;
}

/** role="switch" (DESIGN §6.17): 44 × 26 track, garis-kuat off / bandung on, thumb slides with spring.snappy. */
export function Switch({ checked, onCheckedChange, label, description, disabled, className, labelAfter, onInk, ...aria }: SwitchProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const descId = `${id}-desc`;
  const track = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={label ? labelId : undefined}
      aria-label={label ? undefined : aria["aria-label"]}
      aria-describedby={description ? descId : undefined}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-[26px] w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-ink transition-colors duration-150",
        "before:absolute before:-inset-[9px] before:content-[''] disabled:cursor-not-allowed disabled:opacity-60",
        checked ? "bg-bandung" : "bg-garis-kuat",
        onInk && "border-santan",
      )}
    >
      <m.span
        aria-hidden
        className="absolute left-[1px] top-[1px] size-5 rounded-full border-[1.5px] border-ink bg-white"
        initial={false}
        animate={{ x: checked ? 18 : 0 }}
        transition={spring.snappy}
      />
    </button>
  );
  if (!label) return <span className={className}>{track}</span>;
  return (
    <div className={cn("flex items-center gap-3", !labelAfter && "justify-between", className)}>
      {labelAfter && track}
      <div className="min-w-0">
        <span id={labelId} className={cn("text-label", onInk ? "text-santan" : "text-ink")} onClick={() => !disabled && onCheckedChange(!checked)}>
          {label}
        </span>
        {description && (
          <p id={descId} className={cn("text-caption", onInk ? "text-ink-dim" : "text-ink-soft")}>
            {description}
          </p>
        )}
      </div>
      {!labelAfter && track}
    </div>
  );
}
