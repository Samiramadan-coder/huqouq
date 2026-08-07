import {
  FileText,
  ArrowRight,
  CircleAlert,
  CalendarDays,
  type LucideIcon,
  BriefcaseBusiness,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";

type OptionItem = {
  key: "case" | "consultation" | "service";
  icon: LucideIcon;
  href: string;
  featured?: boolean;
};

const options: OptionItem[] = [
  {
    key: "case",
    icon: BriefcaseBusiness,
    href: "/cases/create",
  },
  {
    key: "consultation",
    icon: CalendarDays,
    href: "/lawyers",
    featured: true,
  },
  {
    key: "service",
    icon: FileText,
    href: "/services",
  },
];

export default async function Options() {
  const locale = await getLocale();
  const t = await getTranslations("ForClients.options");

  return (
    <section className="bg-white py-20 lg:py-27.5">
      <div className="container max-w-7xl">
        <div className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary">
            {t("eyebrow")}
          </span>

          <h2
            className={cn(
              "text-3xl md:text-4xl font-semibold text-primary leading-tight mb-12 mt-5 text-balance",
              { "font-lora": locale === "en" },
            )}
          >
            {t("title")}
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-16">
          {options.map(({ key, icon: Icon, href, featured }) => (
            <article
              key={key}
              className={
                featured
                  ? "flex min-h-75 flex-col rounded-sm bg-primary px-8 py-8 text-white"
                  : "flex min-h-75 flex-col rounded-sm border border-secondary/20 bg-background px-8 py-8"
              }
            >
              <div
                className={
                  featured
                    ? "flex size-11 items-center justify-center rounded-sm bg-white/20"
                    : "flex size-11 items-center justify-center rounded-sm bg-[#F2EBDD]"
                }
              >
                <Icon className="size-5 text-[#CFA74F]" strokeWidth={1.5} />
              </div>

              <h3
                className={cn("mt-6 text-[22px] font-medium", {
                  "font-lora": locale === "en",
                  "text-white": featured,
                  "text-primary": !featured,
                })}
              >
                {t(`${key}.title`)}
              </h3>

              <p
                className={`mt-3 text-[14px] leading-[1.65] sm:text-[15px] ${
                  featured ? "text-white/55" : "text-primary/60"
                }`}
              >
                {t(`${key}.description`)}
              </p>

              <Link
                href={href}
                className="mt-auto inline-flex items-center gap-2 pt-6 text-[14px] font-semibold text-secondary"
              >
                {t(`${key}.cta`)}

                <ArrowRight
                  className="size-4 rtl:rotate-180"
                  strokeWidth={1.5}
                />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-6 rounded-sm border border-[#E8CACA] bg-[#FFF9F9] px-7 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4">
            <CircleAlert
              className="mt-0.5 size-5 shrink-0 text-red-500"
              strokeWidth={1.5}
            />

            <div>
              <h3 className="text-[14px] font-semibold text-red-400">
                {t("emergency.title")}
              </h3>

              <p className="mt-1 max-w-117.5 text-[14px] leading-[1.6] text-primary/55">
                {t("emergency.description")}
              </p>
            </div>
          </div>

          <Link
            href="/emergency"
            className="inline-flex shrink-0 items-center gap-2 text-[14px] font-semibold text-red-400"
          >
            {t("emergency.cta")}

            <ArrowRight className="size-4 rtl:rotate-180" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
