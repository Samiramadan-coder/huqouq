import {
  Banknote,
  FileText,
  Globe2,
  House,
  Landmark,
  Layers3,
  Monitor,
  Phone,
  Shield,
  Users,
  Building2,
  type LucideIcon,
  BriefcaseBusiness,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

type ExpertiseItem = {
  key:
    | "criminal"
    | "family"
    | "commercial"
    | "realEstate"
    | "civil"
    | "labor"
    | "constitutional"
    | "financial"
    | "maritime"
    | "privateInternational"
    | "public"
    | "administrative";
  icon: LucideIcon;
};

const expertise: ExpertiseItem[] = [
  {
    key: "criminal",
    icon: Shield,
  },
  {
    key: "family",
    icon: Users,
  },
  {
    key: "commercial",
    icon: BriefcaseBusiness,
  },
  {
    key: "realEstate",
    icon: House,
  },
  {
    key: "civil",
    icon: FileText,
  },
  {
    key: "labor",
    icon: Monitor,
  },
  {
    key: "constitutional",
    icon: Layers3,
  },
  {
    key: "financial",
    icon: Banknote,
  },
  {
    key: "maritime",
    icon: Phone,
  },
  {
    key: "privateInternational",
    icon: Globe2,
  },
  {
    key: "public",
    icon: Building2,
  },
  {
    key: "administrative",
    icon: Landmark,
  },
];

export default async function Expertise() {
  const locale = await getLocale();
  const t = await getTranslations("ForClients.expertise");

  return (
    <section className="bg-white py-20 lg:py-26.25">
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

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-16 lg:grid-cols-4 xl:grid-cols-6">
          {expertise.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="flex min-h-25 flex-col items-center justify-center rounded-sm border px-4 py-5 text-center border-secondary/20 bg-background"
            >
              <Icon className="size-6 text-primary/65" strokeWidth={1.3} />
              <span
                className={cn(
                  "mt-3 text-[13px] leading-[1.3] text-primary/65",
                  { "font-lora": locale === "en" },
                )}
              >
                {t(`items.${key}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
