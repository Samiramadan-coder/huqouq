import {
  BadgeCheck,
  FileText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

type VerificationStep = {
  key: "submitted" | "reviewed" | "verified";
  number: string;
  icon: LucideIcon;
};

const steps: VerificationStep[] = [
  {
    key: "submitted",
    number: "01",
    icon: FileText,
  },
  {
    key: "reviewed",
    number: "02",
    icon: ShieldCheck,
  },
  {
    key: "verified",
    number: "03",
    icon: BadgeCheck,
  },
];

export default async function Verification() {
  const locale = await getLocale();
  const t = await getTranslations("About.verification");

  return (
    <section className="py-20 sm:px-10 lg:py-30">
      <div className="container max-w-6xl">
        <div className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary">
            {t("eyebrow")}
          </span>

          <h2
            className={cn(
              "text-4xl md:text-5xl font-bold mb-8 leading-tight text-center",
              { "font-lora": locale === "en" },
            )}
          >
            {t("title")}
          </h2>

          <p className="mx-auto mt-5 max-w-132.5 text-base leading-relaxed text-primary/50">
            {t("description")}
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3 lg:mt-17.5">
          {steps.map(({ key, number, icon: Icon }) => (
            <article
              key={key}
              className="min-h-55 rounded-sm border border-secondary/20 bg-white px-8 py-8"
            >
              <div className="flex items-center gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-secondary text-[11px] font-medium text-secondary">
                  {number}
                </span>

                <Icon className="size-5 text-[#A9BBC9]" strokeWidth={1.4} />
              </div>

              <h3
                className={cn("mt-7 text-[19px] font-semibold text-primary", {
                  "font-lora": locale === "en",
                })}
              >
                {t(`${key}.title`)}
              </h3>

              <p className="mt-3 text-[14px] leading-[1.65] text-primary/50">
                {t(`${key}.description`)}
              </p>
            </article>
          ))}
        </div>

        <p
          className={cn("mt-14 text-center text-[15px] italic text-secondary", {
            "font-lora": locale === "en",
          })}
        >
          {t("footer")}
        </p>
      </div>
    </section>
  );
}
