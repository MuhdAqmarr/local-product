import type { ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { controlClasses, describedBy, Field } from "./field";

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  id: string;
  label?: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
  fieldClassName?: string;
}

export function Textarea({ id, label, helper, error, className, fieldClassName, ...rest }: TextareaProps) {
  const control = (
    <textarea
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, Boolean(helper), Boolean(error))}
      className={cn(controlClasses(Boolean(error)), "min-h-[120px] resize-y py-3", className)}
      {...rest}
    />
  );
  if (!label) return control;
  return (
    <Field id={id} label={label} helper={helper} error={error} required={rest.required} className={fieldClassName}>
      {control}
    </Field>
  );
}
