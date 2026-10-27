import { useLocale } from "next-intl";

// Currency labels shown next to amounts, per locale; unknown codes fall back to the code itself
const CURRENCY_LABELS: Record<string, Record<string, string>> = {
  ar: { AED: "درهم" },
};

/**
 * Locale-aware date, number and money formatters shared across the site.
 * Digits stay Latin in every locale.
 */
export function createFormatters(locale: string) {
  const isArabic = locale === "ar";

  // e.g. "1,500"; decimals only when the value has them
  const number = (value: number | string | null | undefined) =>
    new Intl.NumberFormat(locale, {
      numberingSystem: "latn",
      maximumFractionDigits: 2,
    }).format(Number(value ?? 0));

  // Puts the currency label on the side the locale reads it from
  const withCurrency = (amount: string, currency?: string | null) => {
    const code = currency || "AED";
    const label = CURRENCY_LABELS[locale]?.[code] ?? code;

    return isArabic ? `${amount} ${label}` : `${label} ${amount}`;
  };

  // e.g. "AED 1,500" / "1,500 درهم"
  const money = (
    value: number | string | null | undefined,
    currency?: string | null,
  ) => withCurrency(number(value), currency);

  // e.g. "AED 1,000 – 5,000" / "1,000 – 5,000 درهم"
  const moneyRange = (
    min: number | string | null | undefined,
    max: number | string | null | undefined,
    currency?: string | null,
  ) => withCurrency(`${number(min)} – ${number(max)}`, currency);

  // e.g. "Oct 25, 2026" / "25 أكتوبر 2026"; empty when the value is unparsable
  const date = (value: string | Date | null | undefined) => {
    if (!value) return "";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";

    return new Intl.DateTimeFormat(locale, {
      numberingSystem: "latn",
      day: isArabic ? "numeric" : "2-digit",
      month: isArabic ? "long" : "short",
      year: "numeric",
    }).format(parsed);
  };

  return { number, money, moneyRange, date };
}

export type Formatters = ReturnType<typeof createFormatters>;

/**
 * Formatters bound to the current locale, for client and non-async server components.
 * Async server components use `getFormatters` from "@/lib/format.server".
 */
export function useFormatters() {
  return createFormatters(useLocale());
}
