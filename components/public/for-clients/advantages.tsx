import {
  BarChart3,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

type AdvantageItem = {
  key: "verified" | "compare" | "privacy" | "support";
  icon: LucideIcon;
};

const advantages: AdvantageItem[] = [
  {
    key: "verified",
    icon: ShieldCheck,
  },
  {
    key: "compare",
    icon: BarChart3,
  },
  {
    key: "privacy",
    icon: LockKeyhole,
  },
  {
    key: "support",
    icon: HeartPulse,
  },
];

export default async function Advantages() {
  const locale = await getLocale();
  const t = await getTranslations("ForClients.advantages");

  return (
    <section className="py-20 lg:py-27.5">
      <div className="container max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center"
        >
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
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:gap-6">
          {advantages.map(({ key, icon: Icon }, index) => (
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
              className="flex gap-5 rounded-sm border border-secondary/20 bg-white px-8 py-8"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-secondary/20">
                <Icon className="size-5 text-secondary" strokeWidth={1.5} />
              </div>

              <div>
                <h3
                  className={cn(
                    "text-[19px] font-medium text-primary sm:text-[20px]",
                    {
                      "font-lora": locale === "en",
                    },
                  )}
                >
                  {t(`${key}.title`)}
                </h3>

                <p className="mt-2 max-w-117.5 text-[14px] leading-[1.7] text-primary/55 sm:text-[15px]">
                  {t(`${key}.description`)}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
