import Image from "next/image";
import * as motion from "motion/react-client";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function Hero() {
  const locale = await getLocale();
  const t = await getTranslations("ForClients.hero");

  return (
    <section className="py-16 sm:px-10 lg:py-15 overflow-x-hidden">
      <div className="container max-w-7xl grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-137.5"
        >
          <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-accent mb-4">
            {t("eyebrow")}
          </span>

          <h1
            className={cn(
              "text-4xl md:text-5xl xl:text-[3.25rem] text-primary leading-tight text-balance mb-6",
              { "font-lora": locale === "en" },
            )}
          >
            {t("titleStart")}{" "}
            <span className="text-accent">{t("titleHighlight")}</span>
          </h1>

          <p className="mt-7 max-w-130 text-[17px] leading-[1.75] text-primary/60">
            {t("description")}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-13.5 items-center justify-center gap-4 rounded-sm bg-accent px-8 text-[14px] font-semibold text-primary transition-opacity hover:opacity-90"
            >
              {t("postCase")}

              <ArrowRight className="size-4 rtl:rotate-180" strokeWidth={1.7} />
            </Link>

            <Link
              href="/lawyers"
              className="inline-flex h-13.5 items-center justify-center rounded-sm border border-primary/25 px-8 text-[14px] font-medium text-primary/70 transition-colors hover:border-primary hover:text-primary"
            >
              {t("browseLawyers")}
            </Link>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: locale === "ar" ? -32 : 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-143.75"
        >
          <div className="rounded-[5px] bg-accent/10 p-3">
            <div className="relative aspect-4/3 overflow-hidden rounded-[3px]">
              <Image
                src="/for-clients-hero.png"
                alt={t("imageAlt")}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 575px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Privacy card */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
            className="absolute -bottom-4 -inset-s-1 flex min-w-43.75 items-center gap-3 rounded-[3px] bg-white px-4 py-3 shadow-[0_8px_25px_rgba(0,0,0,0.14)] sm:-inset-s-2.5"
          >
            <LockKeyhole
              className="size-4.25 shrink-0 text-accent"
              strokeWidth={1.4}
            />

            <div>
              <span className="block text-[9px] uppercase tracking-[0.15em] text-primary/40">
                {t("privacy.label")}
              </span>

              <span
                className={cn("block text-[14px] font-semibold text-primary", {
                  "font-lora": locale === "en",
                })}
              >
                {t("privacy.value")}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
