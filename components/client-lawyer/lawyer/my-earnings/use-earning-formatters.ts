import { useFormatter, useLocale } from "next-intl";
import { useFormatters } from "@/lib/format";

// Locale-aware formatters shared by the earnings components.
// Digits follow the locale (Arabic-Indic in Arabic), matching the rest of the site.
export function useEarningFormatters() {
  const format = useFormatter();
  const numberingSystem = useLocale() === "ar" ? "arab" : "latn";
  // Money comes from the site-wide formatter so currency labels match everywhere
  const { money } = useFormatters();

  const count = (value: number) =>
    format.number(value, { numberingSystem });

  // Whole-number percentage of a ratio, e.g. 0.9 → "90%"
  const percent = (ratio: number) =>
    format.number(ratio, {
      style: "percent",
      numberingSystem,
      maximumFractionDigits: 0,
    });

  // Short day and month, e.g. "Jun 8"; falls back to the raw value if unparsable
  const day = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return format.dateTime(date, {
      month: "short",
      day: "numeric",
      numberingSystem,
    });
  };

  return { count, money, percent, day };
}
