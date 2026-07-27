import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MessageCircle, Video } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "../ui/button";

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
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.85fr] lg:gap-28">
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-secondary">
              {t("Label")}
            </p>

            <h2 className="font-lora text-4xl font-semibold leading-[1.08] text-primary md:text-5xl">
              {t("Title.Line1")}
              <br />
              <span className="text-secondary">{t("Title.Highlight")}</span>
            </h2>

            <p className="mt-7 max-w-lg text-base leading-6 text-muted-foreground">
              {t("Description")}
            </p>

            <div className="mt-10 space-y-5">
              {benefits.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-secondary/40 text-secondary">
                    <Icon size={15} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm text-foreground/55">{text}</p>
                </div>
              ))}
            </div>

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
          </div>

          <div className="mx-auto w-full max-w-md rounded-xl border border-secondary/30 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="relative size-14 overflow-hidden rounded-full border border-secondary/30">
                <Image
                  src="/get-started-hero.png"
                  alt={t("Card.LawyerName")}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-lora text-base font-semibold text-primary">
                  {t("Card.LawyerName")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("Card.Specialization")}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded-full bg-muted px-2 py-1 text-primary">
                    {t("Card.Verified")}
                  </span>
                  <span className="text-secondary">{t("Card.Price")}</span>
                </div>
              </div>
            </div>

            <div className="my-5 border-t border-border" />

            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {t("Card.SelectDate")}
            </p>

            <div className="grid grid-cols-5 gap-2">
              {dates.map((item) => (
                <button
                  key={item.date}
                  className={`rounded-lg px-2 py-3 text-center ${
                    item.active
                      ? "bg-primary text-white"
                      : "bg-background text-primary"
                  }`}
                >
                  <span className="block text-[9px] opacity-60">
                    {item.day}
                  </span>

                  <span className="mt-1 block text-sm font-medium">
                    {item.date}
                  </span>
                </button>
              ))}
            </div>

            <p className="mb-3 mt-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {t("Card.AvailableTimes")}
            </p>

            <div className="flex flex-wrap gap-2">
              {times.map((time) => (
                <button
                  key={time}
                  className={`rounded-full border px-4 py-2 text-xs ${
                    time === "2:00 PM"
                      ? "border-secondary bg-secondary text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            <Button className="mt-6 h-11 w-full rounded-md bg-primary text-white hover:bg-primary/90">
              {t("Card.Confirm")}
            </Button>
          </div>
        </div>

        <p className="mt-16 text-center text-xs tracking-wide text-muted-foreground/60">
          {t("Footer.Starting")}
          <span className="mx-2">·</span>
          {t("Footer.Specializations")}
          <span className="mx-2">·</span>
          {t("Footer.Response")}
        </p>
      </div>
    </section>
  );
}
