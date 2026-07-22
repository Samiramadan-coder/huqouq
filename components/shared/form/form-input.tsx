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
import { Input } from "@/components/ui/input";

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  className?: string;
  inputClassName?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  description?: ReactNode;
};

export default function FormInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  register,
  errors,
  className,
  inputClassName,
  type = "text",
  disabled = false,
  prefix,
  suffix,
  description,
}: FormInputProps<T>) {
  const error = get(errors, name);

  const inputRegister =
    type === "number"
      ? register(name, {
          valueAsNumber: true,
        })
      : register(name);

  const hasAddon = Boolean(prefix || suffix);

  return (
    <Field className={className} data-invalid={!!error}>
      {label && (
        <FieldLabel
          htmlFor={name}
          className={cn(
            "text-xs text-primary/50 uppercase tracking-widest font-semibold",
            required && "after:ms-1 after:text-destructive after:content-['*']",
          )}
        >
          {label}
        </FieldLabel>
      )}

      <FieldContent>
        <div className="space-y-1.5">
          {hasAddon ? (
            <div
              className={cn(
                "flex h-11 overflow-hidden rounded-none",
                "border-0 border-b border-border",
                "transition-colors",
                "focus-within:border-b-ring",
                error && "border-b-destructive",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              {prefix && (
                <div className="flex shrink-0 items-center px-3 text-xs text-muted-foreground">
                  {prefix}
                </div>
              )}

              <Input
                {...inputRegister}
                id={name}
                type={type}
                placeholder={placeholder}
                aria-invalid={!!error}
                disabled={disabled}
                className={cn(
                  "h-full min-w-0 flex-1 rounded-none bg-transparent px-0 shadow-none",
                  "[border-width:0]",
                  "focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  "aria-invalid:border-0 aria-invalid:ring-0",
                  "placeholder:text-base placeholder:text-border",
                  inputClassName,
                )}
              />

              {suffix && (
                <div className="flex shrink-0 items-center px-3 text-xs text-muted-foreground">
                  {suffix}
                </div>
              )}
            </div>
          ) : (
            <Input
              {...inputRegister}
              id={name}
              type={type}
              placeholder={placeholder}
              aria-invalid={!!error}
              disabled={disabled}
              className={cn(
                "h-11 rounded-none border-0 border-b border-border",
                "focus-visible:border-b-ring focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-base placeholder:text-border",
                inputClassName,
              )}
            />
          )}

          <FieldError errors={[error]} />
          {description && <FieldDescription>{description}</FieldDescription>}
        </div>
      </FieldContent>
    </Field>
  );
}
