import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, BriefcaseBusiness, FileText, Scale } from "lucide-react";

// TODO: replace with real data from the API
const stats = [
  {
    count: 5,
    icon: Scale,
    label: "NewServiceRequests",
    linkLabel: "BrowseServices",
    href: "/lawyer/services",
    highlighted: true,
  },
  {
    count: 2,
    icon: FileText,
    label: "ActiveServicesInProgress",
    linkLabel: "MyActiveServices",
    href: "/lawyer/active-services",
    highlighted: false,
  },
  {
    count: 3,
    icon: BriefcaseBusiness,
    label: "ServiceOffersAwaiting",
    linkLabel: "MyServiceOffers",
    href: "/lawyer/service-offers",
    highlighted: false,
  },
] as const;

export default function LegalServices() {
  const t = useTranslations("Lawyer.Dashboard");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-semibold text-primary ltr:font-lora">
          {t("LegalServices")}
        </h3>

        <Link
          href="/lawyer/services"
          className="text-sm text-accent flex items-center gap-1 ms-auto"
        >
          {t("BrowseServices")}
          <ArrowRight className="rtl:rotate-180 size-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(
          ({ count, icon: Icon, label, linkLabel, href, highlighted }) => (
            <div
              key={label}
              className={cn(
                "rounded-sm border p-5 flex flex-col gap-1",
                highlighted
                  ? "bg-accent/10 border-accent/30"
                  : "bg-white border-secondary",
              )}
            >
              <div
                className={cn(
                  "size-9 rounded-sm flex items-center justify-center mb-3",
                  highlighted ? "bg-accent/15" : "bg-accent/5",
                )}
              >
                <Icon
                  className={cn(
                    "size-4",
                    highlighted ? "text-accent" : "text-primary/45",
                  )}
                  aria-hidden="true"
                />
              </div>

              <p
                className={cn(
                  "text-2xl font-bold ltr:font-lora",
                  highlighted ? "text-accent" : "text-primary",
                )}
              >
                {count}
              </p>
              <p className="text-sm text-primary/55">{t(label)}</p>

              <Link
                href={href}
                className={cn(
                  "mt-3 text-sm font-medium flex items-center gap-1 w-fit",
                  highlighted
                    ? "text-accent hover:text-accent/80"
                    : "text-primary/55 hover:text-primary",
                )}
              >
                {t(linkLabel)}
                <ArrowRight className="rtl:rotate-180 size-3.5" />
              </Link>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
