import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { controlClasses, describedBy, Field } from "./field";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label?: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
  /** Leading icon inside the field (20 px). */
  icon?: ReactNode;
  fieldClassName?: string;
}

/** Text input, h-12, 16 px text (no iOS zoom). With `label` it renders the full Field (label/helper/error). */
export function Input({ id, label, helper, error, icon, className, fieldClassName, ...rest }: InputProps) {
  const control = (
    <div className="relative h-fit">
      {icon && <span aria-hidden className="pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center text-ink-soft [&>svg]:size-5">{icon}</span>}
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, Boolean(helper), Boolean(error))}
        className={cn(controlClasses(Boolean(error)), "h-12", icon && "pl-11", className)}
        {...rest}
      />
    </div>
  );
  if (!label) return control;
  return (
    <Field id={id} label={label} helper={helper} error={error} required={rest.required} className={fieldClassName}>
      {control}
    </Field>
  );
}
