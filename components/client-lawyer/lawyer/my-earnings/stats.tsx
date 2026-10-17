import {
  Clock,
  Banknote,
  TrendingUp,
  CircleCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Summary } from "@/types/lawyer/my-earnings";
import { useFormatter, useTranslations } from "next-intl";

type StatItem = {
  key: "TotalEarned" | "Pending" | "ReadyForPayout" | "PaidToDate";
  value: number;
  icon: LucideIcon;
  cardClassName: string;
  labelClassName: string;
  valueClassName?: string;
};

export default function Stats({ summary }: { summary: Summary }) {
  const format = useFormatter();
  const tCommon = useTranslations("Common");
  const t = useTranslations("Lawyer.MyEarnings.Stats");

  const stats: StatItem[] = [
    {
      key: "TotalEarned",
      value: summary.total_earned,
      icon: TrendingUp,
      cardClassName: "bg-white border-secondary",
      labelClassName: "text-primary/45",
    },
    {
      key: "Pending",
      value: summary.pending,
      icon: Clock,
      cardClassName: "bg-white border-amber-200",
      labelClassName: "text-amber-500",
    },
    {
      key: "ReadyForPayout",
      value: summary.ready,
      icon: CircleCheck,
      cardClassName: "bg-accent/10 border-accent/30",
      labelClassName: "text-accent",
      valueClassName: "text-2xl text-accent",
    },
    {
      key: "PaidToDate",
      value: summary.paid,
      icon: Banknote,
      cardClassName: "bg-white border-emerald-200",
      labelClassName: "text-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(
        ({
          key,
          value,
          icon: Icon,
          cardClassName,
          labelClassName,
          valueClassName,
        }) => (
          <div
            key={key}
            className={cn("rounded-xs border px-5 py-5", cardClassName)}
          >
            <div
              className={cn(
                "flex items-center gap-2 text-xs uppercase tracking-widest",
                labelClassName,
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{t(`${key}.Label`)}</span>
            </div>

            <p
              className={cn(
                "mt-4 text-xl font-semibold text-primary ltr:font-lora",
                valueClassName,
              )}
            >
              {tCommon("AED")}{" "}
              {format.number(value, { numberingSystem: "latn" })}
            </p>

            <p className="mt-1 text-[11px] text-primary/40">
              {t(`${key}.Hint`)}
            </p>
          </div>
        ),
      )}
    </div>
  );
}
