import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, BadgeCheck } from "lucide-react";

import { cn } from "@/lib/utils";

export default async function Hero() {
  const locale = await getLocale();
  const t = await getTranslations("ForLawyers.hero");

  return (
    <section className="py-16 sm:px-10 lg:py-15">
      <div className="container max-w-7xl grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        {/* Content */}
        <div className="max-w-137.5">
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary">
            {t("eyebrow")}
          </span>

          <h1
            className={cn(
              "mb-6 text-4xl leading-tight text-primary text-balance md:text-5xl xl:text-[3.25rem]",
              {
                "font-lora": locale === "en",
              },
            )}
          >
            {t("titleStart")}{" "}
            <span className="text-[#CDA753]">{t("titleHighlight")}</span>
          </h1>

          <p className="mt-7 max-w-130 text-[17px] leading-[1.75] text-primary/60">
            {t("description")}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/lawyer/register"
              className="inline-flex h-13.5 items-center justify-center gap-4 rounded-sm bg-secondary px-8 text-[14px] font-semibold text-primary transition-opacity hover:opacity-90"
            >
              {t("joinAsLawyer")}

              <ArrowRight className="size-4 rtl:rotate-180" strokeWidth={1.7} />
            </Link>

            <Link
              href="/for-clients#how-it-works"
              className="inline-flex h-13.5 items-center justify-center rounded-sm border border-primary/25 px-8 text-[14px] font-medium text-primary/70 transition-colors hover:border-primary hover:text-primary"
            >
              {t("seeHowItWorks")}
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative mx-auto w-full max-w-143.75">
          <div className="rounded-[5px] bg-secondary/10 p-3">
            <div className="relative aspect-4/3 overflow-hidden rounded-[3px]">
              <Image
                src="/get-started-hero.png"
                alt={t("imageAlt")}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 575px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Verified card */}
          <div className="absolute -bottom-4 -inset-s-1 flex min-w-43.75 items-center gap-3 rounded-[3px] bg-white px-4 py-3 shadow-[0_8px_25px_rgba(0,0,0,0.14)] sm:-inset-s-2.5">
            <BadgeCheck
              className="size-4.25 shrink-0 text-emerald-700"
              strokeWidth={1.4}
            />

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
          </div>
        </div>
      </div>
    </section>
  );
}
