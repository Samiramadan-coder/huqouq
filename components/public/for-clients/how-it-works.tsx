"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, CircleAlert } from "lucide-react";

type Tab = "clients" | "lawyers";

type Step = {
  key: "step1" | "step2" | "step3" | "step4";
  number: string;
  image: string;
  side: "start" | "end";
};

const clientSteps: Step[] = [
  {
    key: "step1",
    number: "01",
    side: "start",
    image: "/about-hero.png",
  },
  {
    key: "step2",
    number: "02",
    side: "end",
    image: "/about-hero.png",
  },
  {
    key: "step3",
    number: "03",
    side: "start",
    image: "/about-hero.png",
  },
  {
    key: "step4",
    number: "04",
    side: "end",
    image: "/about-hero.png",
  },
];

const lawyerSteps: Step[] = [
  {
    key: "step1",
    number: "01",
    side: "start",
    image: "/about-hero.png",
  },
  {
    key: "step2",
    number: "02",
    side: "end",
    image: "/about-hero.png",
  },
  {
    key: "step3",
    number: "03",
    side: "start",
    image: "/about-hero.png",
  },
  {
    key: "step4",
    number: "04",
    side: "end",
    image: "/about-hero.png",
  },
];

export default function HowItWorks() {
  const t = useTranslations("ForClients.howItWorks");
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState<Tab>("clients");

  const isClients = activeTab === "clients";

  const steps = isClients ? clientSteps : lawyerSteps;

  return (
    <section className="py-20 lg:py-27.5">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
            {t("eyebrow")}
          </span>

          <h2
            className={cn(
              "my-5 text-3xl font-semibold leading-tight text-primary text-balance md:text-4xl lg:text-5xl",
              {
                "font-lora": locale === "en",
              },
            )}
          >
            {t("title")}
          </h2>

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-primary/55 text-pretty md:text-lg">
            {t("description")}
          </p>
        </div>

        {/* Tabs */}
        <div className="mx-auto mt-12 flex w-fit rounded-sm border border-primary/20 bg-white p-1">
          <button
            type="button"
            onClick={() => setActiveTab("clients")}
            className={cn(
              "h-9 min-w-32 cursor-pointer rounded-sm px-5 text-xs font-medium transition-colors",
              isClients
                ? "bg-primary text-white"
                : "text-primary/50 hover:text-primary",
            )}
          >
            {t("tabs.clients")}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("lawyers")}
            className={cn(
              "h-9 min-w-32 cursor-pointer rounded-sm px-5 text-xs font-medium transition-colors",
              !isClients
                ? "bg-primary text-white"
                : "text-primary/50 hover:text-primary",
            )}
          >
            {t("tabs.lawyers")}
          </button>
        </div>

        {/* Desktop Timeline */}
        <div className="relative mx-auto mt-14 hidden max-w-180 md:block">
          {/* Center Line */}
          <div className="absolute inset-y-0 inset-s-1/2 w-px -translate-x-1/2 bg-secondary rtl:translate-x-1/2" />

          <div>
            {steps.map(({ key, number, image, side }) => (
              <div
                key={`${activeTab}-${key}`}
                className="relative grid min-h-85 grid-cols-[1fr_120px_1fr] items-center"
              >
                {/* Timeline Point */}
                <div className="absolute inset-s-1/2 top-0 z-10 size-2 -translate-x-1/2 rounded-full border border-secondary bg-background rtl:translate-x-1/2" />

                {side === "start" ? (
                  <>
                    <StepContent
                      number={number}
                      title={t(`${activeTab}.${key}.title`)}
                      description={t(`${activeTab}.${key}.description`)}
                      align="end"
                      locale={locale}
                    />

                    <div />

                    <StepImage
                      src={image}
                      alt={t(`${activeTab}.${key}.imageAlt`)}
                    />
                  </>
                ) : (
                  <>
                    <StepImage
                      src={image}
                      alt={t(`${activeTab}.${key}.imageAlt`)}
                    />

                    <div />

                    <StepContent
                      number={number}
                      title={t(`${activeTab}.${key}.title`)}
                      description={t(`${activeTab}.${key}.description`)}
                      align="start"
                      locale={locale}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="relative mt-14 space-y-12 md:hidden">
          <div className="absolute inset-y-0 inset-s-4.75 w-px bg-secondary" />

          {steps.map(({ key, number, image }) => (
            <div key={`${activeTab}-${key}`} className="relative ps-14">
              <div className="absolute inset-s-0 top-0 z-10 flex size-10 items-center justify-center rounded-full border border-secondary bg-background font-serif text-sm text-secondary">
                {number}
              </div>

              <StepImage
                src={image}
                alt={t(`${activeTab}.${key}.imageAlt`)}
                mobile
              />

              <h3
                className={cn(
                  "mt-5 max-w-md text-2xl font-medium leading-snug text-primary",
                  {
                    "font-lora": locale === "en",
                  },
                )}
              >
                {t(`${activeTab}.${key}.title`)}
              </h3>

              <p className="mt-3 max-w-md text-sm leading-[1.65] text-primary/55">
                {t(`${activeTab}.${key}.description`)}
              </p>
            </div>
          ))}
        </div>

        {/* Emergency */}
        <div className="mx-auto mt-12 flex max-w-5xl flex-col gap-5 bg-primary px-7 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <CircleAlert
              className="mt-0.5 size-4 shrink-0 text-secondary"
              strokeWidth={1.5}
            />

            <p className="max-w-xl text-xs leading-relaxed text-white">
              {t(`${activeTab}.emergency.description`)}
            </p>
          </div>

          <Link
            href="/emergency"
            className="inline-flex shrink-0 items-center gap-2 text-xs font-medium text-secondary"
          >
            {t(`${activeTab}.emergency.cta`)}

            <ArrowRight className="size-3.5 rtl:rotate-180" strokeWidth={1.5} />
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href={isClients ? "/cases/create" : "/lawyer/register"}
            className="inline-flex h-12.5 min-w-52 items-center justify-center gap-3 rounded-[3px] bg-secondary px-8 text-sm font-semibold text-primary"
          >
            {t(`${activeTab}.button`)}

            <ArrowRight className="size-4 rtl:rotate-180" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function StepImage({
  src,
  alt,
  mobile = false,
}: {
  src: string;
  alt: string;
  mobile?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-secondary/20 bg-white shadow-sm",
        mobile ? "aspect-square w-full max-w-60" : "mx-auto size-60",
      )}
    >
      <Image src={src} alt={alt} fill sizes="240px" className="object-cover" />
    </div>
  );
}

function StepContent({
  number,
  title,
  description,
  align,
  locale,
}: {
  number: string;
  title: string;
  description: string;
  align: "start" | "end";
  locale: string;
}) {
  return (
    <div
      className={cn(
        align === "end"
          ? "justify-self-end text-end"
          : "justify-self-start text-start",
      )}
    >
      <span
        dir="ltr"
        className={cn(
          "block text-6xl font-semibold leading-none text-secondary/20",
          {
            "font-lora": locale === "en",
          },
        )}
      >
        {number}
      </span>

      <h3
        className={cn(
          "mt-2 max-w-62.5 text-2xl font-medium leading-snug text-primary",
          {
            "font-lora": locale === "en",
          },
        )}
      >
        {title}
      </h3>

      <p className="mt-3 max-w-62.5 text-sm leading-[1.65] text-primary/55">
        {description}
      </p>
    </div>
  );
}
