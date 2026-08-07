import { getLocale, getTranslations } from "next-intl/server";
import { BadgeCheck, Heart, LockKeyhole, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ValueItem = {
  key: "verified" | "transparent" | "support";
  icon: LucideIcon;
};

const values: ValueItem[] = [
  {
    key: "verified",
    icon: BadgeCheck,
  },
  {
    key: "transparent",
    icon: LockKeyhole,
  },
  {
    key: "support",
    icon: Heart,
  },
];

export default async function Values() {
  const locale = await getLocale();
  const t = await getTranslations("About.values");

  return (
    <section className="bg-[#ede9e1] px-6 py-20 sm:px-10 lg:py-27.5">
      <div className="container max-w-7xl">
        <h2
          className={cn(
            "text-4xl md:text-5xl font-bold mb-8 leading-tight text-center",
            { "font-lora": locale === "en" },
          )}
        >
          {t("title")}
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
          {values.map(({ key, icon: Icon }) => (
            <article
              key={key}
              className="rounded-[8px] border border-secondary/20 bg-white px-8 py-9"
            >
              <Icon className="size-7 text-secondary" strokeWidth={1.6} />
              <h3
                className={cn("mt-5 text-xl font-bold mb-3 text-primary", {
                  "font-lora": locale === "en",
                })}
              >
                {t(`${key}.title`)}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.65] text-primary/70">
                {t(`${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
