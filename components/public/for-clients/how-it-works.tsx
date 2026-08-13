"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CircleAlert } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

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
    <section className="overflow-hidden py-20 md:py-28">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="text-center"
        >
          <span className="text-sm font-medium text-secondary">
            {t("eyebrow")}
          </span>

          <h2
            className={cn(
              "my-5 text-balance text-3xl font-semibold leading-tight text-primary md:text-4xl lg:text-5xl",
              {
                "font-lora": locale === "en",
              },
            )}
          >
            {t("title")}
          </h2>

          <p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-primary/55 md:text-lg">
            {t("description")}
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="mx-auto mt-12 flex w-fit rounded-sm border border-primary/20 bg-white p-1"
        >
          <button
            type="button"
            onClick={() => setActiveTab("clients")}
            className={cn(
              "relative h-10 min-w-32 cursor-pointer overflow-hidden rounded-sm px-5 text-sm font-medium transition-colors",
              isClients ? "text-white" : "text-primary/50 hover:text-primary",
            )}
          >
            {isClients && (
              <motion.span
                layoutId="active-how-it-works-tab"
                className="absolute inset-0 bg-primary"
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 35,
                }}
              />
            )}

            <span className="relative z-10">{t("tabs.clients")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("lawyers")}
            className={cn(
              "relative h-10 min-w-32 cursor-pointer overflow-hidden rounded-sm px-5 text-sm font-medium transition-colors",
              !isClients ? "text-white" : "text-primary/50 hover:text-primary",
            )}
          >
            {!isClients && (
              <motion.span
                layoutId="active-how-it-works-tab"
                className="absolute inset-0 bg-primary"
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 35,
                }}
              />
            )}

            <span className="relative z-10">{t("tabs.lawyers")}</span>
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -15,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
          >
            {/* Desktop Timeline */}
            <div className="relative mx-auto mt-14 hidden max-w-200 md:block">
              {/* Center Line */}
              <motion.div
                initial={{
                  scaleY: 0,
                }}
                whileInView={{
                  scaleY: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.1,
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                }}
                className="absolute inset-y-0 inset-s-1/2 w-px origin-top -translate-x-1/2 bg-secondary rtl:translate-x-1/2"
              />

              <div>
                {steps.map(({ key, number, image, side }, index) => (
                  <motion.div
                    key={`${activeTab}-${key}`}
                    initial={{
                      opacity: 0,
                      y: 50,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.25,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.06,
                      ease: "easeOut",
                    }}
                    className="relative grid min-h-85 grid-cols-[1fr_120px_1fr] items-center"
                  >
                    {/* Timeline Point */}
                    <motion.div
                      initial={{
                        scale: 0,
                        opacity: 0,
                      }}
                      whileInView={{
                        scale: 1,
                        opacity: 1,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.1,
                      }}
                      className="absolute inset-s-1/2 top-0 z-10 size-2 -translate-x-1/2 rounded-full border border-secondary bg-background rtl:translate-x-1/2"
                    />

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
                          direction="end"
                        />
                      </>
                    ) : (
                      <>
                        <StepImage
                          src={image}
                          alt={t(`${activeTab}.${key}.imageAlt`)}
                          direction="start"
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
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Timeline */}
            <div className="relative mt-14 space-y-12 md:hidden">
              <motion.div
                initial={{
                  scaleY: 0,
                }}
                whileInView={{
                  scaleY: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.1,
                }}
                transition={{
                  duration: 1.4,
                  ease: "easeOut",
                }}
                className="absolute inset-y-0 inset-s-4.75 w-px origin-top bg-secondary"
              />

              {steps.map(({ key, number, image }, index) => (
                <motion.div
                  key={`${activeTab}-${key}`}
                  initial={{
                    opacity: 0,
                    x: locale === "ar" ? 25 : -25,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  className="relative ps-14"
                >
                  <motion.div
                    initial={{
                      scale: 0,
                      opacity: 0,
                    }}
                    whileInView={{
                      scale: 1,
                      opacity: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="absolute inset-s-0 top-0 z-10 flex size-10 items-center justify-center rounded-full border border-secondary bg-background font-serif text-sm text-secondary"
                  >
                    {number}
                  </motion.div>

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
                </motion.div>
              ))}
            </div>

            {/* Emergency */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.55,
                ease: "easeOut",
              }}
              className="mx-auto mt-12 flex max-w-5xl flex-col gap-5 bg-primary px-7 py-5 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-4">
                <CircleAlert
                  className="mt-0.5 size-4 shrink-0 text-secondary"
                  strokeWidth={1.5}
                />

                <p className="max-w-xl text-sm leading-relaxed text-white/80">
                  {t(`${activeTab}.emergency.description`)}
                </p>
              </div>

              <Link
                href="/emergency"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-secondary"
              >
                {t(`${activeTab}.emergency.cta`)}

                <ArrowRight
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              className="mt-10 text-center"
            >
              <Link
                href={isClients ? "/" : "/sign-up/lawyer"}
                className="group inline-flex h-12.5 min-w-52 items-center justify-center gap-3 rounded-[3px] bg-secondary px-8 text-sm font-semibold text-primary transition-transform duration-300 hover:-translate-y-1"
              >
                {t(`${activeTab}.button`)}

                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function StepImage({
  src,
  alt,
  mobile = false,
  direction = "start",
}: {
  src: string;
  alt: string;
  mobile?: boolean;
  direction?: "start" | "end";
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: mobile ? 0 : direction === "start" ? -35 : 35,
        y: mobile ? 20 : 0,
        scale: 0.95,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className={cn(
        "group relative overflow-hidden border border-secondary/20 bg-white shadow-sm",
        mobile ? "aspect-square w-full max-w-60" : "mx-auto size-60",
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={mobile ? "240px" : "240px"}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </motion.div>
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
    <motion.div
      initial={{
        opacity: 0,
        x: align === "end" ? -35 : 35,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className={cn(
        align === "end"
          ? "justify-self-end text-end"
          : "justify-self-start text-start",
      )}
    >
      <motion.span
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.5,
          delay: 0.1,
          ease: "easeOut",
        }}
        className={cn(
          "block text-6xl font-semibold leading-none text-secondary/20",
          {
            "font-lora": locale === "en",
          },
        )}
      >
        {number}
      </motion.span>

      <h3
        className={cn(
          "mt-2 text-balance text-2xl leading-snug text-primary md:text-3xl",
          {
            "font-lora": locale === "en",
          },
        )}
      >
        {title}
      </h3>

      <p className="mt-3 max-w-sm text-base leading-[1.65] text-primary/55">
        {description}
      </p>
    </motion.div>
  );
}
