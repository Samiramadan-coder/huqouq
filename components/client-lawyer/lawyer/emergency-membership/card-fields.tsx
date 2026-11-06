"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { CardValues } from "@/types/lawyer/emergency-membership";
import { Controller, type Control, type Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

// "4242424242424242" -> "4242 4242 4242 4242"
const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

// "1229" -> "12/29"
const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
    : digits;
};

const onlyDigits = (max: number) => (value: string) =>
  value.replace(/\D/g, "").slice(0, max);

const inputClassName =
  "h-11 rounded-sm border-secondary shadow-none focus-visible:border-primary focus-visible:ring-0";

/**
 * Name, number, expiry and CVC inputs for any form that has a `card` object.
 * Values are formatted while typing (spaced number, "MM/YY" expiry, digits-only CVC).
 */
export default function CardFields<T extends { card: CardValues }>({
  control,
  disabled,
}: {
  control: Control<T>;
  disabled?: boolean;
}) {
  const t = useTranslations("Lawyer.EmergencyMembership.Subscribe");

  function renderField({
    name,
    label,
    placeholder,
    autoComplete,
    transform,
  }: {
    name: keyof CardValues;
    label: string;
    placeholder?: string;
    autoComplete: string;
    transform?: (value: string) => string;
  }) {
    const path = `card.${name}` as Path<T>;

    return (
      <Controller
        control={control}
        name={path}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={path} className="text-xs text-primary/55">
              {label}
            </FieldLabel>
            <Input
              {...field}
              value={(field.value as string | undefined) ?? ""}
              id={path}
              dir="ltr"
              placeholder={placeholder}
              autoComplete={autoComplete}
              inputMode={transform ? "numeric" : undefined}
              aria-invalid={fieldState.invalid}
              disabled={disabled}
              onChange={(event) =>
                field.onChange(
                  transform
                    ? transform(event.target.value)
                    : event.target.value,
                )
              }
              className={inputClassName}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    );
  }

  return (
    <>
      {renderField({
        name: "name",
        label: t("name"),
        autoComplete: "cc-name",
      })}

      {renderField({
        name: "number",
        label: t("number"),
        placeholder: "4242 4242 4242 4242",
        autoComplete: "cc-number",
        transform: formatCardNumber,
      })}

      <div className="grid grid-cols-2 gap-4">
        {renderField({
          name: "exp",
          label: t("exp"),
          placeholder: "MM/YY",
          autoComplete: "cc-exp",
          transform: formatExpiry,
        })}
        {renderField({
          name: "cvc",
          label: t("cvc"),
          placeholder: "123",
          autoComplete: "cc-csc",
          transform: onlyDigits(4),
        })}
      </div>
    </>
  );
}
