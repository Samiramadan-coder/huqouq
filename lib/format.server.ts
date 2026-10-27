import { getLocale } from "next-intl/server";
import { createFormatters } from "./format";

/**
 * Formatters bound to the current locale, for async server components.
 */
export async function getFormatters() {
  return createFormatters(await getLocale());
}
