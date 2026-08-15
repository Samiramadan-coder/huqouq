"use client";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import {
  get,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Textarea } from "@/components/ui/textarea";

type FormTextareaProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  className?: string;
  textareaClassName?: string;
  disabled?: boolean;
  description?: ReactNode;
  rows?: number;
};

export default function FormTextarea<T extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  register,
  errors,
  className,
  textareaClassName,
  disabled = false,
  description,
  rows = 4,
}: FormTextareaProps<T>) {
  const error = get(errors, name);

  return (
    <Field className={className} data-invalid={!!error}>
      {label && (
        <FieldLabel
          htmlFor={name}
          className={cn(
            "text-xs font-semibold uppercase tracking-widest text-primary/50",
            required && "after:ms-1 after:text-destructive after:content-['*']",
          )}
        >
          {label}
        </FieldLabel>
      )}

      <FieldContent>
        <div className="space-y-1.5">
          <Textarea
            {...register(name)}
            id={name}
            rows={rows}
            placeholder={placeholder}
            aria-invalid={!!error}
            disabled={disabled}
            className={cn(
              "min-h-28 resize-y rounded-none border-0 border-b border-border bg-transparent shadow-none",

              "focus-visible:border-b-ring",
              "focus-visible:ring-0",
              "focus-visible:ring-offset-0",

              "aria-invalid:border-0",
              "aria-invalid:border-b",
              "aria-invalid:border-destructive",
              "aria-invalid:ring-0",
              "aria-invalid:ring-offset-0",

              "placeholder:text-base placeholder:text-border",
              textareaClassName,
            )}
          />

          <FieldError errors={[error]} />

          {description && (
            <FieldDescription className="text-[11px] text-primary/50">
              {description}
            </FieldDescription>
          )}
        </div>
      </FieldContent>
    </Field>
  );
}
