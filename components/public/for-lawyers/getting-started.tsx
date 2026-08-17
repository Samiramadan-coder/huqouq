import Image from "next/image";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

type Step = {
  key: "account" | "profile" | "verified" | "cases";
  number: string;
  image: string;
  side: "start" | "end";
};

const steps: Step[] = [
  {
    key: "account",
    number: "01",
    image: "/get-started-hero.png",
    side: "start",
  },
  {
    key: "profile",
    number: "02",
    image: "/get-started-hero.png",
    side: "end",
  },
  {
    key: "verified",
    number: "03",
    image: "/get-started-hero.png",
    side: "start",
  },
  {
    key: "cases",
    number: "04",
    image: "/get-started-hero.png",
    side: "end",
  },
];

export default async function GettingStarted() {
  const locale = await getLocale();
  const t = await getTranslations("ForLawyers.gettingStarted");

  return (
    <section className="py-20 lg:py-27.5">
      <div className="container max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            {t("eyebrow")}
          </span>

          <h2
            className={cn(
              "my-5 text-3xl font-semibold leading-tight text-primary text-balance md:text-4xl",
              {
                "font-lora": locale === "en",
              },
            )}
          >
            {t("title")}
          </h2>
        </motion.div>

        {/* Desktop Timeline */}
        <div className="relative mx-auto mt-16 hidden max-w-200 md:block">
          {/* Line */}
          <div className="absolute inset-y-0 inset-s-1/2 w-px -translate-x-1/2 bg-accent rtl:translate-x-1/2" />

          <div className="space-y-3">
            {steps.map(({ key, number, image, side }, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                className="relative grid min-h-70 grid-cols-[1fr_120px_1fr] items-center"
              >
                {/* Marker */}
                <div className="absolute inset-s-1/2 top-1/2 z-10 size-1.75 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent bg-background rtl:translate-x-1/2" />

                {side === "start" ? (
                  <>
                    <StepContent
                      number={number}
                      title={t(`${key}.title`)}
                      description={t(`${key}.description`)}
                      align="end"
                      locale={locale}
                    />

                    <div />

                    <StepImage src={image} alt={t(`${key}.imageAlt`)} />
                  </>
                ) : (
                  <>
                    <StepImage src={image} alt={t(`${key}.imageAlt`)} />

                    <div />

                    <StepContent
                      number={number}
                      title={t(`${key}.title`)}
                      description={t(`${key}.description`)}
                      align="start"
                      locale={locale}
                    />
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="relative mt-14 space-y-12 md:hidden">
          <div className="absolute inset-y-0 inset-s-4.75 w-px bg-accent" />

          {steps.map(({ key, number, image }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: index * 0.06,
                ease: "easeOut",
              }}
              className="relative flex gap-6"
            >
              <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-accent bg-background text-sm text-accent">
                {number}
              </div>

              <div className="min-w-0 pb-5">
                <StepImage src={image} alt={t(`${key}.imageAlt`)} mobile />

                <h3
                  className={cn(
                    "mt-5 text-2xl font-medium leading-snug text-primary",
                    {
                      "font-lora": locale === "en",
                    },
                  )}
                >
                  {t(`${key}.title`)}
                </h3>

                <p className="mt-3 max-w-90 text-sm leading-[1.65] text-primary/55">
                  {t(`${key}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
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
        "relative overflow-hidden border border-accent/20 bg-white shadow-sm",
        mobile ? "aspect-4/3 w-full max-w-60" : "mx-auto aspect-4/3 w-60",
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
      className={
        align === "end"
          ? "justify-self-end text-end"
          : "justify-self-start text-start"
      }
    >
      <span
        dir="ltr"
        className={cn(
          "block text-6xl font-semibold leading-none text-accent/20",
          {
            "font-lora": locale === "en",
          },
        )}
      >
        {number}
      </span>

      <h3
        className={cn("mt-2 text-2xl md:text-3xl leading-snug text-primary", {
          "font-lora": locale === "en",
        })}
      >
        {title}
      </h3>

      <p className="mt-3 text-base leading-[1.65] text-primary/55">
        {description}
      </p>
    </div>
  );
}
