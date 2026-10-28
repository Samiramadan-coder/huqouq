"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";

// Minutes left until `deadline`, refreshed every minute; null before mount to avoid a hydration mismatch
function useMinutesUntil(deadline: string) {
  const [minutes, setMinutes] = useState<number | null>(null);

  useEffect(() => {
    const update = () =>
      setMinutes(
        Math.floor((new Date(deadline).getTime() - Date.now()) / 60_000),
      );

    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [deadline]);

  return minutes;
}

// Time left before the delivery is approved automatically, e.g. "3 days 3 hours left"
export default function ReviewCountdown({ deadline }: { deadline: string }) {
  const t = useTranslations("Client.LegalServices.Countdown");
  const format = useFormatters();
  const minutesLeft = useMinutesUntil(deadline);

  if (minutesLeft === null || minutesLeft <= 0) return null;

  const days = Math.floor(minutesLeft / 1440);
  const hours = Math.floor((minutesLeft % 1440) / 60);
  const minutes = minutesLeft % 60;
  const unit = (key: "days" | "hours" | "minutes", count: number) =>
    t(key, { count, value: format.number(count) });

  // Days and hours while more than a day is left, then hours and minutes
  const parts =
    days > 0
      ? [unit("days", days), hours > 0 && unit("hours", hours)]
      : [hours > 0 && unit("hours", hours), unit("minutes", minutes)];

  return (
    <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-700/80">
      <Clock className="size-3.5 shrink-0" aria-hidden="true" />
      {t("left", { time: parts.filter(Boolean).join(" ") })}
    </p>
  );
}
