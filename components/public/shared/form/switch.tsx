"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

type FormSwitchProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  description?: string;
  control: Control<T>;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  onHandleChange?: (value: boolean) => void;
};

export default function FormSwitch<T extends FieldValues>({
  name,
  label,
  description,
  control,
  className,
  labelClassName,
  descriptionClassName,
  onHandleChange,
}: FormSwitchProps<T>) {
  const switchId = `switch-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          orientation="horizontal"
          className={className}
          data-invalid={fieldState.invalid}
        >
          <Switch
            id={switchId}
            checked={field.value ?? false}
            onCheckedChange={(value) => {
              field.onChange(value);
              if (onHandleChange) {
                onHandleChange(value);
              }
            }}
            aria-invalid={fieldState.invalid}
          />

          <FieldContent>
            <FieldLabel
              htmlFor={switchId}
              className={cn("text-sm font-semibold", labelClassName)}
            >
              {label}
            </FieldLabel>

            {description && (
              <FieldDescription
                className={cn(
                  "text-sm text-muted-foreground",
                  descriptionClassName,
                )}
              >
                {description}
              </FieldDescription>
            )}

            <FieldError errors={[fieldState.error]} />
          </FieldContent>
        </Field>
      )}
    />
  );
}
