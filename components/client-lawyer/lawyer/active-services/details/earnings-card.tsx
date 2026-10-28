import { cn } from "@/lib/utils";
import { Banknote } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getFormatters } from "@/lib/format.server";
import { Earnings, PayoutStatus } from "@/types/lawyer/active-services";

const dotClassName: Record<PayoutStatus, string> = {
  held: "bg-primary/35",
  pending_release: "bg-amber-500",
  cancelled: "bg-red-200",
  released: "bg-emerald-500",
};

// What the lawyer earns from the service and where the payout is: Held → Pending until {date} → Ready → Paid
export default async function EarningsCard({
  agreedFee,
  earnings,
}: {
  agreedFee: number;
  earnings: Earnings;
}) {
  const t = await getTranslations("Lawyer.ActiveServices.Details");
  const format = await getFormatters();
  const status = earnings.payout_status;

  const hint =
    status === "held"
      ? t("payoutHint.held")
      : status === "pending_release"
        ? t("payoutHint.pending")
        : status === "cancelled"
          ? t("payoutHint.cancelled")
          : status === "released"
            ? t("payoutHint.paid")
            : null;

  return (
    <div className="bg-white border border-secondary rounded-sm p-5">
      <h2 className="flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-3">
        <Banknote className="size-3.5" aria-hidden="true" />
        {t("earnings")}
      </h2>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-primary/50">{t("agreedFee")}</span>
          <span className="text-sm font-bold text-primary">
            {format.money(agreedFee)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-primary/50">
            {t("huqouqFee", {
              percentage: format.number(earnings.fee_percentage),
            })}
          </span>
          <span className="text-xs text-primary/50">
            − {format.money(earnings.platform_fee)}
          </span>
        </div>
        <div className="h-px bg-secondary"></div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-primary/60">
            {t("yourEarnings")}
          </span>
          <span className="text-base font-bold text-accent">
            {format.money(earnings.your_earnings)}
          </span>
        </div>
        <div className="h-px bg-secondary"></div>

        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-2">
            {t("payoutStatus")}
          </p>
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <span
              className={cn(
                "size-2 rounded-full shrink-0",
                dotClassName[status] ?? "bg-primary/35",
              )}
              aria-hidden="true"
            />
            {earnings.payout_status_label}
          </p>
          {hint && (
            <p className="text-xs text-primary/40 leading-relaxed mt-1">
              {hint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
