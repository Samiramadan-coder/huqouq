import { useFormatter } from "next-intl";
import { useFormatters } from "@/lib/format";

// Locale-aware formatters shared by the earnings components.
// Digits stay Latin in every locale, matching the rest of the dashboard.
export function useEarningFormatters() {
  const format = useFormatter();
  // Money comes from the site-wide formatter so currency labels match everywhere
  const { money } = useFormatters();

  const count = (value: number) =>
    format.number(value, { numberingSystem: "latn" });

  // Whole-number percentage of a ratio, e.g. 0.9 → "90%"
  const percent = (ratio: number) =>
    format.number(ratio, {
      style: "percent",
      numberingSystem: "latn",
      maximumFractionDigits: 0,
    });

  // Short day and month, e.g. "Jun 8"; falls back to the raw value if unparsable
  const day = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return format.dateTime(date, {
      month: "short",
      day: "numeric",
      numberingSystem: "latn",
    });
  };

  return { count, money, percent, day };
}
