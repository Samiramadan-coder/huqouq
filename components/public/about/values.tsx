import { getLocale, getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
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
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className={cn(
            "text-4xl md:text-5xl font-bold mb-8 leading-tight text-center",
            { "font-lora": locale === "en" },
          )}
        >
          {t("title")}
        </motion.h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
          {values.map(({ key, icon: Icon }, index) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              className="rounded-[8px] border border-accent/20 bg-white px-8 py-9"
            >
              <Icon className="size-7 text-accent" strokeWidth={1.6} />
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
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
