import type { ReactNode, SelectHTMLAttributes } from "react";
import { ChevronDown } from "@/components/ui/lucide";
import { cn } from "@/lib/utils";
import { controlClasses, describedBy, Field } from "./field";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  id: string;
  options: readonly SelectOption[];
  /** Optional first option with an empty value ("Semua negeri"). */
  placeholder?: string;
  label?: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
  fieldClassName?: string;
}

/** Native <select> styled like the input, with a ChevronDown. */
export function Select({ id, options, placeholder, label, helper, error, className, fieldClassName, ...rest }: SelectProps) {
  const control = (
    <div className="relative h-fit">
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, Boolean(helper), Boolean(error))}
        className={cn(controlClasses(Boolean(error)), "h-12 cursor-pointer appearance-none pr-11", className)}
        {...rest}
      >
        {placeholder != null && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden size={20} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink" />
    </div>
  );
  if (!label) return control;
  return (
    <Field id={id} label={label} helper={helper} error={error} required={rest.required} className={fieldClassName}>
      {control}
    </Field>
  );
}
