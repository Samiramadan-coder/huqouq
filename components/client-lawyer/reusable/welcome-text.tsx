"use client";

import { cn } from "@/lib/utils";
import { useUser } from "@/providers/user-provider";
import { useLocale, useTranslations } from "next-intl";

export default function WelcomeText() {
  const { user } = useUser();
  const locale = useLocale();
  const t = useTranslations("Lawyer.Dashboard");

  const now = new Date();
  const hour = now.getHours();

  const greeting =
    hour >= 5 && hour < 12
      ? "GoodMorning"
      : hour >= 12 && hour < 18
        ? "GoodAfternoon"
        : "GoodEvening";

  const formattedDate = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-EG" : "en-GB",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(now);

  return (
    <div>
      <h1
        suppressHydrationWarning
        className={cn("text-2xl font-semibold", locale === "en" && "font-lora")}
      >
        {t(greeting)}, {user?.name}
      </h1>

      <p suppressHydrationWarning className="mt-1 text-sm text-primary/40">
        {formattedDate}
      </p>
    </div>
  );
}
