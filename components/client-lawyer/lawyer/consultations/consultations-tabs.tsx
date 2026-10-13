"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

// `exact` tabs match only their own path, the others also match nested routes
const tabs = [
  { href: "/lawyer/consultations", label: "Bookings", exact: true },
  {
    href: "/lawyer/consultations/availability-settings",
    label: "AvailabilitySettings",
    exact: false,
  },
] as const;

export default function ConsultationsTabs() {
  const pathname = usePathname();
  const t = useTranslations("Lawyer.Consultations");

  const activeHref =
    tabs.find(
      (tab) =>
        !tab.exact &&
        (pathname === tab.href || pathname.startsWith(`${tab.href}/`)),
    )?.href ?? tabs.find((tab) => tab.exact)?.href;

  return (
    <nav
      aria-label={t("TabsLabel")}
      className="p-px border border-secondary flex"
    >
      {tabs.map((tab) => {
        const isActive = tab.href === activeHref;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "text-sm px-4 py-1.5",
              isActive && "font-bold bg-white",
            )}
          >
            {t(`Tabs.${tab.label}`)}
          </Link>
        );
      })}
    </nav>
  );
}
