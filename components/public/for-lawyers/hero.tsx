import Image from "next/image";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default async function Hero() {
  const locale = await getLocale();
  const t = await getTranslations("ForLawyers.hero");

  return (
    <section className="overflow-hidden py-16 md:py-24 lg:py-28">
      <div className="container max-w-7xl grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Content */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
        >
          <motion.span
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.05,
              ease: "easeOut",
            }}
            className="inline-block text-sm font-medium text-secondary"
          >
            {t("eyebrow")}
          </motion.span>

          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.12,
              ease: "easeOut",
            }}
            className={cn(
              "mb-6 mt-5 text-balance text-4xl leading-tight text-primary md:text-5xl xl:text-[3.25rem]",
              {
                "font-lora": locale === "en",
              },
            )}
          >
            {t("titleStart")}{" "}
            <span className="text-[#CDA753]">{t("titleHighlight")}</span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="mt-7 max-w-130 text-[17px] leading-[1.75] text-primary/60"
          >
            {t("description")}
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.28,
              ease: "easeOut",
            }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/lawyer/register"
              className="group inline-flex h-13.5 items-center justify-center gap-4 rounded-sm bg-secondary px-8 text-[14px] font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
            >
              {t("joinAsLawyer")}

              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                strokeWidth={1.7}
              />
            </Link>

            <Link
              href="/for-clients#how-it-works"
              className="inline-flex h-13.5 items-center justify-center rounded-sm border border-primary/25 px-8 text-[14px] font-medium text-primary/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              {t("seeHowItWorks")}
            </Link>
          </motion.div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{
            opacity: 0,
            x: locale === "ar" ? -40 : 40,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="relative mx-auto w-full max-w-143.75"
        >
          <div className="rounded-[5px] bg-secondary/10 p-3">
            <div className="group relative aspect-4/3 overflow-hidden rounded-[3px]">
              <Image
                src="/get-started-hero.png"
                alt={t("imageAlt")}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 575px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
          </div>

          {/* Verified card */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.6,
              delay: 0.55,
              ease: "easeOut",
            }}
            className="absolute -bottom-4 -inset-s-1 flex min-w-43.75 items-center gap-3 rounded-[3px] bg-white px-4 py-3 shadow-[0_8px_25px_rgba(0,0,0,0.14)] sm:-inset-s-2.5"
          >
            <motion.div
              initial={{
                scale: 0,
                rotate: -20,
              }}
              animate={{
                scale: 1,
                rotate: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 18,
                delay: 0.7,
              }}
            >
              <BadgeCheck
                className="size-4.25 shrink-0 text-emerald-700"
                strokeWidth={1.4}
              />
            </motion.div>

            <div>
              <span className="block text-[9px] uppercase tracking-[0.15em] text-primary/40">
                {t("badge.label")}
              </span>

              <span
                className={cn("block text-[14px] font-semibold text-primary", {
                  "font-lora": locale === "en",
                })}
              >
                {t("badge.value")}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
