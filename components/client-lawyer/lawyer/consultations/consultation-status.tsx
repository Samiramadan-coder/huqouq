"use client";

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Consultation } from "@/types/lawyer/consultations";

const statusClassName: Record<string, string> = {
  cancelled: "border-destructive/20 bg-destructive/5 text-destructive/80",
  completed: "border-green-200 bg-green-50 text-green-700",
  needs_new_time: "border-amber-200 bg-amber-50 text-amber-700",
};

const chipClassName =
  "inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs whitespace-nowrap";

// Minutes left until `startsAt`, refreshed every minute; null before mount to avoid a hydration mismatch
function useMinutesUntil(startsAt: string) {
  const [minutes, setMinutes] = useState<number | null>(null);

  useEffect(() => {
    const update = () =>
      setMinutes(
        Math.floor((new Date(startsAt).getTime() - Date.now()) / 60_000),
      );

    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [startsAt]);

  return minutes;
}

export default function ConsultationStatus({
  consultation,
}: {
  consultation: Consultation;
}) {
  const t = useTranslations("Lawyer.Consultations.Bookings");
  const minutesLeft = useMinutesUntil(consultation.starts_at);

  if (
    consultation.status === "upcoming" &&
    minutesLeft !== null &&
    minutesLeft > 0
  ) {
    const countdown = t("Countdown", {
      hours: Math.floor(minutesLeft / 60),
      minutes: minutesLeft % 60,
    });

    return (
      <span
        className={cn(
          chipClassName,
          "border-secondary bg-muted text-primary/40",
        )}
        aria-label={t("StartsIn", { time: countdown })}
      >
        <Clock className="size-3.5" aria-hidden="true" />
        {countdown}
      </span>
    );
  }

  return (
    <span
      className={cn(
        chipClassName,
        statusClassName[consultation.status] ??
          "border-secondary bg-muted text-primary/50",
      )}
    >
      {consultation.status_label}
    </span>
  );
}
