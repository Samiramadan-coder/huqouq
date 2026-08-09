import {
  FileCheck2,
  PenLine,
  Bell,
  FileText,
  BriefcaseBusiness,
  SquarePen,
  BadgeCheck,
  MoreHorizontal,
  Layers3,
  ChartNoAxesColumnIncreasing,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { Button } from "../../ui/button";
import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";

export default async function LegalServices() {
  const t = await getTranslations("Home.LegalServices");

  const services = [
    {
      icon: FileCheck2,
      label: t("Services.ContractReview"),
    },
    {
      icon: PenLine,
      label: t("Services.ContractDrafting"),
    },
    {
      icon: Bell,
      label: t("Services.LegalNotice"),
    },
    {
      icon: FileText,
      label: t("Services.LegalMemos"),
    },
    {
      icon: BriefcaseBusiness,
      label: t("Services.CompanyFormation"),
    },
    {
      icon: SquarePen,
      label: t("Services.CompanyAmendment"),
    },
    {
      icon: BadgeCheck,
      label: t("Services.TrademarkRegistration"),
    },
    {
      icon: MoreHorizontal,
      label: t("Services.Other"),
    },
  ];

  const benefits = [
    {
      icon: Layers3,
      text: t("Benefits.ServiceTypes"),
    },
    {
      icon: ChartNoAxesColumnIncreasing,
      text: t("Benefits.Compare"),
    },
    {
      icon: ShieldCheck,
      text: t("Benefits.Payment"),
    },
  ];

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="container max-w-7xl">
        <div className="grid items-start gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-secondary"
            >
              {t("Label")}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.6,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-lora text-4xl font-semibold leading-[1.08] text-primary md:text-5xl"
            >
              {t("Title.Line1")}
              <br />
              <span className="text-secondary">{t("Title.Highlight")}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.55,
                delay: 0.16,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-7 max-w-lg text-base leading-6 text-muted-foreground"
            >
              {t("Description")}
            </motion.p>

            <div className="mt-10 space-y-5">
              {benefits.map(({ icon: Icon, text }, index) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.22 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-secondary/40 text-secondary">
                    <Icon size={15} strokeWidth={1.5} />
                  </div>

                  <p className="text-sm text-foreground/55">{text}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.5,
                delay: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Button
                size="lg"
                className="mt-10 h-12 rounded-sm bg-secondary px-7 text-primary hover:bg-secondary/90"
              >
                {t("Action")}

                <ArrowRight
                  size={16}
                  className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180"
                />
              </Button>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {services.map(({ icon: Icon, label }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.45,
                  delay: (index % 4) * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  flex min-h-28
                  flex-col items-center justify-center
                  rounded-sm border border-border/55
                  bg-background
                  px-4 py-5 text-center
                "
              >
                <Icon
                  size={24}
                  strokeWidth={1.2}
                  className="mb-3 text-foreground/55"
                />

                <p className="font-lora text-sm leading-4 text-foreground/55">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
