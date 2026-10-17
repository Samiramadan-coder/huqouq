import { useFormatter } from "next-intl";

// Locale-aware formatters shared by the earnings components.
// Digits stay Latin in every locale, matching the rest of the dashboard.
export function useEarningFormatters() {
  const format = useFormatter();

  const count = (value: number) =>
    format.number(value, { numberingSystem: "latn" });

  // e.g. "AED 5,840" / "5,840 د.إ.‏"; decimals only when the amount has them
  const money = (value: number, currency?: string | null) =>
    format.number(value, {
      style: "currency",
      currency: currency || "AED",
      numberingSystem: "latn",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      trailingZeroDisplay: "stripIfInteger",
    });

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
