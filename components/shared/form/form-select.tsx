"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { cn } from "@/lib/utils";
import { Field, FieldContent, FieldError, FieldLabel } from "../../ui/field";

type SelectOption = {
  label: string;
  value: string;
};

type FormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  control: Control<T>;
  options: SelectOption[];
  groupLabel?: string;
  className?: string;
  triggerClassName?: string;
};

export default function FormSelect<T extends FieldValues>({
  name,
  label,
  placeholder = "Choose",
  required,
  control,
  options,
  groupLabel,
  className,
  triggerClassName,
}: FormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className={className} data-invalid={fieldState.invalid}>
          <FieldLabel
            htmlFor={name}
            className={cn(
              "text-xs text-primary/50 uppercase font-semibold",
              required &&
                "after:ms-1 after:text-destructive after:content-['*']",
            )}
          >
            {label}
          </FieldLabel>

          <FieldContent>
            <div className="space-y-1.5">
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  id={name}
                  aria-invalid={fieldState.invalid}
                  className={cn(
                    "h-11 min-h-11 w-full rounded-none border-0 border-b border-border",
                    triggerClassName,
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}

                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <FieldError errors={[fieldState.error]} />
            </div>
          </FieldContent>
        </Field>
      )}
    />
  );
}
