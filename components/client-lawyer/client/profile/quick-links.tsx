import {
  Heart,
  Settings,
  ChevronRight,
  CalendarDays,
  BriefcaseBusiness,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function QuickLinks() {
  const locale = useLocale();
  const tSidebar = useTranslations("Client.Sidebar");
  const tProfile = useTranslations("Client.Profile");

  const links = [
    {
      label: tSidebar("Cases"),
      href: "/client/cases",
      icon: BriefcaseBusiness,
    },
    {
      label: tSidebar("MyConsultations"),
      href: "/client/consultations",
      icon: CalendarDays,
    },
    {
      label: tSidebar("Favorites"),
      href: "/client/favorites",
      icon: Heart,
    },
    {
      label: tSidebar("Settings"),
      href: "/client/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="bg-white border border-secondary rounded-sm overflow-hidden">
      <p
        className={cn(
          "font-semibold px-5 py-3.5 border-b border-secondary",
          locale === "en" ? "font-lora" : "",
        )}
      >
        {tProfile("QuickLinks")}
      </p>
      {links.map(({ label, href, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className="group flex items-center justify-between border-b border-secondary px-5 py-3.5 last:border-b-0 hover:bg-muted/40"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex size-7 items-center justify-center rounded bg-muted">
              <Icon className="size-3.5 text-primary/35" />
            </div>
            <span className="text-sm text-primary">{label}</span>
          </div>
          <ChevronRight className="size-4 text-primary/30 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ))}
    </div>
  );
}
