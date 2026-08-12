import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MessageCircle, Video } from "lucide-react";
import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";

import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";

export default async function Consultations() {
  const t = await getTranslations("Home.Consultations");

  const benefits = [
    {
      icon: Video,
      text: t("Benefits.Video"),
    },
    {
      icon: CalendarDays,
      text: t("Benefits.Schedule"),
    },
    {
      icon: MessageCircle,
      text: t("Benefits.Advice"),
    },
  ];

  const dates = [
    { day: "MON", date: "23" },
    { day: "TUE", date: "24" },
    { day: "WED", date: "25", active: true },
    { day: "THU", date: "26" },
    { day: "FRI", date: "27" },
  ];

  const times = ["9:00 AM", "11:00 AM", "2:00 PM", "4:30 PM"];

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="container max-w-7xl">
        <div className="grid items-center justify-between gap-16 lg:grid-cols-[1fr_0.85fr] lg:gap-28">
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
                asChild
                size="lg"
                className="mt-10 h-12 rounded-sm bg-secondary px-7 text-primary hover:bg-secondary/90"
              >
                <Link href="/lawyers">
                  {t("Action")}
                  <ArrowRight size={16} className="ms-2 rtl:rotate-180" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="flex justify-end">
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full max-w-100 rounded-xl border border-secondary/25 shadow-[0_16px_48px_rgba(27,58,87,0.10)] bg-white p-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.45,
                  delay: 0.22,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center gap-4"
              >
                <div className="relative size-14 overflow-hidden rounded-full border border-secondary/30">
                  <Image
                    src="/get-started-hero.png"
                    alt={t("Card.LawyerName")}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-lora text-[0.9375rem] font-semibold text-primary">
                    {t("Card.LawyerName")}
                  </h3>

                  <p className="text-xs text-primary/50">
                    {t("Card.Specialization")}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="rounded-full bg-muted px-2 py-1 text-primary">
                      {t("Card.Verified")}
                    </span>
                    <span className="text-secondary">{t("Card.Price")}</span>
                  </div>
                </div>
              </motion.div>

              <div className="my-5 border-t border-border" />

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.45,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-primary/35">
                  {t("Card.SelectDate")}
                </p>

                <div className="grid grid-cols-5 gap-2">
                  {dates.map((item, index) => (
                    <motion.button
                      key={item.date}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.34 + index * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`rounded-lg px-2 py-3 text-center ${
                        item.active
                          ? "bg-primary text-white"
                          : "bg-background text-primary"
                      }`}
                    >
                      <span
                        className={cn("block text-[9px] ", {
                          "text-primary/35": !item.active,
                          "text-white/50": item.active,
                        })}
                      >
                        {item.day}
                      </span>

                      <span className="mt-1 block text-sm font-medium">
                        {item.date}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.45,
                  delay: 0.46,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <p className="mb-3 mt-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {t("Card.AvailableTimes")}
                </p>

                <div className="flex flex-wrap gap-2">
                  {times.map((time, index) => (
                    <motion.button
                      key={time}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.5 + index * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`rounded-full border px-3 py-2 text-xs ${
                        time === "2:00 PM"
                          ? "border-secondary bg-secondary text-primary"
                          : "border-[#EDE9E1] text-primary/55"
                      }`}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.45,
                  delay: 0.62,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Button className="mt-6 h-11 w-full rounded-md bg-primary text-white hover:bg-primary/90">
                  {t("Card.Confirm")}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-16 text-center text-xs tracking-wide text-muted-foreground/60"
        >
          {t("Footer.Starting")}
          <span className="mx-2">·</span>
          {t("Footer.Specializations")}
          <span className="mx-2">·</span>
          {t("Footer.Response")}
        </motion.p>
      </div>
    </section>
  );
}
