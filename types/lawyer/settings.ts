import z from "zod";
import { T } from "../shared";

export type PayoutDetailsType = {
  provided: boolean;
  iban: null | string;
  updated_at: null | string;
  account_name: null | string;
};

// Country code, two check digits, then 11–30 alphanumerics (ISO 13616: 15–34 chars)
const IBAN_PATTERN = /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/;
const UAE_IBAN_PATTERN = /^AE\d{21}$/;

// ISO 7064 mod-97: move the first four chars to the end, map letters to 10–35
function hasValidIbanChecksum(iban: string) {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;

  for (const char of rearranged) {
    const digits = /\d/.test(char) ? char : String(char.charCodeAt(0) - 55);
    for (const digit of digits) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }

  return remainder === 1;
}

// IBAN with spaces removed and letters uppercased before validation
export const ibanSchema = (t: T) =>
  z
    .string()
    .transform((value) => value.replace(/\s+/g, "").toUpperCase())
    .pipe(
      z
        .string()
        .min(1, t("Fields.Iban.Required"))
        .regex(IBAN_PATTERN, t("Fields.Iban.Invalid"))
        .refine(
          (value) => !value.startsWith("AE") || UAE_IBAN_PATTERN.test(value),
          t("Fields.Iban.InvalidUae"),
        )
        .refine(hasValidIbanChecksum, t("Fields.Iban.Invalid")),
    );

export const payoutDetailsSchema = (t: T) =>
  z.object({
    account_name: z.string().trim().min(1, t("Fields.AccountName.Required")),
    iban: ibanSchema(t),
  });

export type PayoutDetailsFormValues = z.infer<
  ReturnType<typeof payoutDetailsSchema>
>;
