import { useLocale } from "next-intl";

// Currency labels shown next to amounts, per locale; unknown codes fall back to the code itself
const CURRENCY_LABELS: Record<string, Record<string, string>> = {
  ar: { AED: "درهم" },
};

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/**
 * Locale-aware date, number and money formatters shared across the site.
 * Arabic uses Arabic-Indic digits (١٬٥٠٠); other locales use Latin digits.
 */
export function createFormatters(locale: string) {
  const isArabic = locale === "ar";
  const numberingSystem = isArabic ? "arab" : "latn";

  // e.g. "1,500" / "١٬٥٠٠"; decimals only when the value has them
  const number = (value: number | string | null | undefined) =>
    new Intl.NumberFormat(locale, {
      numberingSystem,
      maximumFractionDigits: 2,
    }).format(Number(value ?? 0));

  // Puts the currency label on the side the locale reads it from
  const withCurrency = (amount: string, currency?: string | null) => {
    const code = currency || "AED";
    const label = CURRENCY_LABELS[locale]?.[code] ?? code;

    return isArabic ? `${amount} ${label}` : `${label} ${amount}`;
  };

  // e.g. "AED 1,500" / "١٬٥٠٠ درهم"
  const money = (
    value: number | string | null | undefined,
    currency?: string | null,
  ) => withCurrency(number(value), currency);

  // e.g. "AED 1,000 – 5,000" / "١٬٠٠٠ – ٥٬٠٠٠ درهم"
  const moneyRange = (
    min: number | string | null | undefined,
    max: number | string | null | undefined,
    currency?: string | null,
  ) => withCurrency(`${number(min)} – ${number(max)}`, currency);

  // e.g. "Oct 25, 2026" / "٢٥ أكتوبر ٢٠٢٦"; empty when the value is unparsable
  const date = (value: string | Date | null | undefined) => {
    if (!value) return "";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";

    return new Intl.DateTimeFormat(locale, {
      numberingSystem,
      day: isArabic ? "numeric" : "2-digit",
      month: isArabic ? "long" : "short",
      year: "numeric",
    }).format(parsed);
  };

  // Swaps the digits inside preformatted text, e.g. "500+" → "٥٠٠+", "12:30" → "١٢:٣٠"
  const digits = (value: number | string | null | undefined) => {
    const text = String(value ?? "");
    return isArabic
      ? text.replace(/\d/g, (digit) => ARABIC_DIGITS[Number(digit)])
      : text;
  };

  // e.g. "5 minutes ago" / "منذ ٥ دقائق"; empty when the value is unparsable
  const relativeTime = (value: string | Date | null | undefined) => {
    if (!value) return "";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";

    const seconds = Math.round((parsed.getTime() - Date.now()) / 1000);
    const units: [Intl.RelativeTimeFormatUnit, number][] = [
      ["year", 60 * 60 * 24 * 365],
      ["month", 60 * 60 * 24 * 30],
      ["week", 60 * 60 * 24 * 7],
      ["day", 60 * 60 * 24],
      ["hour", 60 * 60],
      ["minute", 60],
    ];
    const [unit, size] = units.find(
      ([, size]) => Math.abs(seconds) >= size,
    ) ?? ["second", 1];

    return new Intl.RelativeTimeFormat(locale, {
      numeric: "auto",
      numberingSystem,
    } as Intl.RelativeTimeFormatOptions).format(
      Math.round(seconds / size),
      unit,
    );
  };

  return { number, money, moneyRange, date, digits, relativeTime };
}

export type Formatters = ReturnType<typeof createFormatters>;

/**
 * Formatters bound to the current locale, for client and non-async server components.
 * Async server components use `getFormatters` from "@/lib/format.server".
 */
export function useFormatters() {
  return createFormatters(useLocale());
}
