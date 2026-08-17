import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

const emirates = [
  "dubai",
  "abuDhabi",
  "sharjah",
  "ajman",
  "rasAlKhaimah",
  "fujairah",
  "ummAlQuwain",
] as const;

export default async function Coverage() {
  const locale = await getLocale();
  const t = await getTranslations("About.coverage");

  return (
    <section className="bg-[#ede9e1] py-20 sm:px-10 lg:py-30">
      <div className="container max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className={cn("text-4xl md:text-5xl font-bold mb-8 leading-tight", {
            "font-lora": locale === "en",
          })}
        >
          {t("title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.06, ease: "easeOut" }}
          className="text-lg leading-relaxed max-w-2xl mb-12 text-primary/80"
        >
          {t("description")}
        </motion.p>

        <div className="mt-12 flex flex-wrap gap-3">
          {emirates.map((emirate, index) => (
            <motion.div
              key={emirate}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.42,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              className="min-w-28 rounded-sm border border-accent/20 bg-background px-5 py-4"
            >
              <h3
                className={cn(
                  "text-[14px] font-semibold whitespace-nowrap text-primary",
                  { "font-lora": locale === "en" },
                )}
              >
                {t(`emirates.${emirate}.name`)}
              </h3>

              <p className="mt-1 text-[11px] whitespace-nowrap text-accent">
                {t(`emirates.${emirate}.lawyers`)}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          className={cn("mt-10 text-[14px] italic text-accent", {
            "font-lora": locale === "en",
          })}
        >
          {t("footer")}
        </motion.p>
      </div>
    </section>
  );
}
