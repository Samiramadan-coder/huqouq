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
} from "../../../ui/select";

import { cn } from "@/lib/utils";
import { Field, FieldContent, FieldError, FieldLabel } from "../../../ui/field";

type SelectOption = {
  label: string;
  value: string | number;
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
  // Check if options contain numeric values
  const hasNumericValues = options.some(
    (option) => typeof option.value === "number",
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handleValueChange = (value: string) => {
          // Convert back to number if the original values were numbers
          if (hasNumericValues) {
            const numValue = Number(value);
            field.onChange(isNaN(numValue) ? value : numValue);
          } else {
            field.onChange(value);
          }
        };

        return (
          <Field className={className} data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor={name}
              className={cn(
                "text-xs text-primary/50 uppercase tracking-widest font-semibold",
                required &&
                  "after:ms-1 after:text-destructive after:content-['*']",
              )}
            >
              {label}
            </FieldLabel>

            <FieldContent>
              <div className="space-y-1.5">
                <Select
                  value={
                    field.value == null ||
                    field.value === "" ||
                    field.value === 0
                      ? undefined
                      : String(field.value)
                  }
                  onValueChange={handleValueChange}
                >
                  <SelectTrigger
                    id={name}
                    aria-invalid={fieldState.invalid}
                    className={cn(
                      "h-11 min-h-11 w-full rounded-none bg-transparent shadow-none",
                      "border-0 border-b border-border",
                      "focus:border-b-ring",
                      "focus:ring-0 focus:ring-offset-0",
                      "focus-visible:ring-0 focus-visible:ring-offset-0",
                      "aria-invalid:border-0",
                      "aria-invalid:border-b",
                      "aria-invalid:border-destructive",
                      "aria-invalid:ring-0",
                      "aria-invalid:ring-offset-0",
                      "data-placeholder:text-base",
                      "data-placeholder:text-border",
                      triggerClassName,
                    )}
                  >
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}

                      {options.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={String(option.value)}
                        >
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
        );
      }}
    />
  );
}
