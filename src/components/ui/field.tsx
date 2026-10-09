import type { ReactNode } from "react";
import { CircleAlert } from "@/components/ui/lucide";
import { cn } from "@/lib/utils";

export interface FieldProps {
  /** id of the control; label, helper and error ids derive from it. */
  id: string;
  label: ReactNode;
  required?: boolean;
  helper?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: ReactNode;
}

export const helperId = (id: string) => `${id}-helper`;
export const errorId = (id: string) => `${id}-error`;

/** aria-describedby for a control inside <Field>. */
export function describedBy(id: string, hasHelper?: boolean, hasError?: boolean) {
  return [hasHelper && helperId(id), hasError && errorId(id)].filter(Boolean).join(" ") || undefined;
}

/** Label above, helper (13 px ink-soft) and error (sambal-pekat + CircleAlert) below. */
export function Field({ id, label, required, helper, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-label text-ink">
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-bandung-pekat">
            *
          </span>
        )}
      </label>
      {children}
      {helper && !error && (
        <p id={helperId(id)} className="text-[13px] leading-snug text-ink-soft">
          {helper}
        </p>
      )}
      {error && (
        <p id={errorId(id)} className="flex items-center gap-1.5 text-[13px] font-semibold leading-snug text-sambal-pekat">
          <CircleAlert aria-hidden size={14} strokeWidth={2.5} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/** Shared control look (input, select, textarea). */
export function controlClasses(invalid?: boolean) {
  return cn(
    "block w-full rounded-input border-[1.5px] bg-putih px-4 text-body text-ink placeholder:text-ink-soft",
    "outline-none transition-none focus:border-telang focus:shadow-[0_0_0_4px_rgb(91_43_201/.18)] focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:bg-kapas disabled:text-ink-soft",
    invalid ? "border-sambal-pekat bg-sambal-tint" : "border-garis-kuat",
  );
}
