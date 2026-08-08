import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

type DemandLevel = "mostActive" | "highDemand" | "growing" | "active";

type Specialization = {
  key:
    | "family"
    | "commercial"
    | "realEstate"
    | "labour"
    | "criminal"
    | "civil"
    | "corporate"
    | "immigration"
    | "intellectualProperty"
    | "inheritance"
    | "banking"
    | "arbitration";
  level: DemandLevel;
};

const specializations: Specialization[] = [
  {
    key: "family",
    level: "mostActive",
  },
  {
    key: "commercial",
    level: "mostActive",
  },
  {
    key: "realEstate",
    level: "mostActive",
  },
  {
    key: "labour",
    level: "highDemand",
  },
  {
    key: "criminal",
    level: "highDemand",
  },
  {
    key: "civil",
    level: "highDemand",
  },
  {
    key: "corporate",
    level: "growing",
  },
  {
    key: "immigration",
    level: "growing",
  },
  {
    key: "intellectualProperty",
    level: "growing",
  },
  {
    key: "inheritance",
    level: "active",
  },
  {
    key: "banking",
    level: "active",
  },
  {
    key: "arbitration",
    level: "active",
  },
];

const levelStyles: Record<DemandLevel, string> = {
  mostActive: "border-secondary/35 bg-secondary/10 text-[#A26B08]",
  highDemand: "border-primary/20 bg-primary/5 text-primary",
  growing: "border-emerald-700/20 bg-emerald-700/5 text-emerald-800",
  active: "border-primary/10 bg-primary/[0.025] text-primary/60",
};

export default async function MarketDemand() {
  const locale = await getLocale();
  const t = await getTranslations("ForLawyers.marketDemand");

  return (
    <section className="py-20 lg:py-27.5 bg-white">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary">
              {t("eyebrow")}
            </span>

            <h2
              className={cn(
                "mt-5 max-w-md text-3xl font-semibold leading-tight text-primary text-balance md:text-4xl",
                {
                  "font-lora": locale === "en",
                },
              )}
            >
              {t("title")}
            </h2>
          </div>

          <p className="max-w-md text-base leading-relaxed text-primary/55 md:justify-self-end">
            {t("description")}
          </p>
        </div>

        {/* Specializations */}
        <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {specializations.map(({ key, level }) => (
            <div key={key} className="flex min-w-0 items-center gap-3">
              <span
                className={cn(
                  "inline-flex min-h-9 items-center rounded-sm border px-3 text-sm font-medium whitespace-nowrap",
                  levelStyles[level],
                )}
              >
                {t(`items.${key}`)}
              </span>

              <span className="text-[10px] font-medium uppercase tracking-wide text-primary/30 whitespace-nowrap">
                {t(`levels.${level}`)}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-12 rounded-sm border border-secondary/25 bg-secondary/4 px-6 py-5">
          <p className="text-sm leading-relaxed text-primary/65">
            <strong className="font-semibold text-[#9A6812]">
              {t("noteTitle")}
            </strong>{" "}
            {t("note")}
          </p>
        </div>
      </div>
    </section>
  );
}
