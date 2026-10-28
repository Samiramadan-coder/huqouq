import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getFormatters } from "@/lib/format.server";

const DAY_MS = 86_400_000;

// Whole days until `deadline`; negative once it has passed. Rendered on the server per request
function daysUntil(deadline: string) {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / DAY_MS);
}

// "Expected delivery {date} | x days left", red once overdue
export default async function DeadlineChip({
  deadline,
  className,
}: {
  deadline: string;
  // Colour of the days-left part while not overdue
  className?: string;
}) {
  const t = await getTranslations("Client.LegalServices");
  const format = await getFormatters();
  const daysLeft = daysUntil(deadline);

  return (
    <span className="self-start inline-flex flex-wrap items-center gap-2 rounded-sm border border-secondary bg-white px-3 py-1.5 text-xs text-primary/50">
      <Clock className="size-3.5 shrink-0" aria-hidden="true" />
      {t("expectedDelivery", { date: format.date(deadline) })}
      <span className="w-px h-3 bg-secondary" aria-hidden="true" />
      <span
        className={cn(
          "font-semibold",
          daysLeft < 0 ? "text-red-700" : (className ?? "text-primary/70"),
        )}
      >
        {daysLeft < 0
          ? t("overdueBy", {
              count: -daysLeft,
              days: format.number(-daysLeft),
            })
          : t("daysLeft", { count: daysLeft, days: format.number(daysLeft) })}
      </span>
    </span>
  );
}
