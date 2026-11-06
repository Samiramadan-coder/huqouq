import { Billing, PaymentCard } from "@/types/lawyer/emergency-membership";

import { cn } from "@/lib/utils";
import UpdateCard from "./update-card";
import { useFormatters } from "@/lib/format";
import { CreditCard, FileText } from "lucide-react";
import DataTable from "../../reusable/data-table";
import { useLocale, useTranslations } from "next-intl";
import { TableCell, TableRow } from "@/components/ui/table";

const statusClassName: Record<Billing["status"], string> = {
  paid: "border-green-200 bg-green-50 text-green-700",
  refunded: "border-secondary bg-secondary/40 text-primary/50",
  failed: "border-red-200 bg-red-50 text-red-700",
};

const cellClassName = "px-5 py-4 text-sm";

export default function BillingHistory({
  billing,
  card,
}: {
  billing: Billing[];
  card: PaymentCard | null;
}) {
  const t = useTranslations("Lawyer.EmergencyMembership.Billing");
  const locale = useLocale();
  const format = useFormatters();

  // e.g. "Sep 26" / "٢٦ سبتمبر"
  const shortDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return new Intl.DateTimeFormat(locale, {
      numberingSystem: locale === "ar" ? "arab" : "latn",
      day: "numeric",
      month: "short",
    }).format(parsed);
  };

  const columns = [
    t("Table.date"),
    t("Table.description"),
    t("Table.amount"),
    t("Table.card"),
    t("Table.status"),
    t("Table.receipt"),
  ];

  return (
    <section aria-labelledby="billing-history-title" className="space-y-3">
      <h2
        id="billing-history-title"
        className="ltr:font-lora text-lg font-semibold text-primary"
      >
        {t("title")}
      </h2>

      <div className="flex items-center gap-4 rounded-sm border border-secondary bg-white p-5">
        <CreditCard className="size-5 text-primary/45" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-xs text-primary/45">{t("paymentMethod")}</p>
          <p className="text-primary">
            {card
              ? t("cardEnding", { last4: format.digits(card.last4) })
              : t("noCard")}
          </p>
        </div>
        <UpdateCard />
      </div>

      <DataTable columns={columns}>
        {billing.length === 0 ? (
          <TableRow>
            <TableCell className="px-5 py-3" colSpan={columns.length}>
              <span className="text-primary/55">{t("empty")}</span>
            </TableCell>
          </TableRow>
        ) : (
          billing.map((payment) => (
            <TableRow key={payment.id} className="border-secondary">
              <TableCell className={cn(cellClassName, "text-primary")}>
                {format.date(payment.paid_at ?? payment.created_at)}
              </TableCell>

              <TableCell className={cn(cellClassName, "text-primary/60")}>
                {t("description", { plan: payment.plan.label })} ·{" "}
                {shortDate(payment.period_start)} –{" "}
                {shortDate(payment.period_end)}
              </TableCell>

              <TableCell className={cn(cellClassName, "text-primary")}>
                {format.money(payment.amount)}
              </TableCell>

              <TableCell className={cn(cellClassName, "text-primary/60")}>
                {payment.card ? (
                  <span dir="ltr">
                    •••• {format.digits(payment.card.last4)}
                  </span>
                ) : (
                  <span className="text-primary/30">—</span>
                )}
              </TableCell>

              <TableCell className={cellClassName}>
                <span
                  className={cn(
                    "inline-flex rounded-sm border px-2 py-0.5 text-xs font-medium",
                    statusClassName[payment.status] ??
                      "border-secondary bg-secondary/40 text-primary",
                  )}
                  title={payment.failure_reason ?? undefined}
                >
                  {t(`status.${payment.status}`)}
                </span>
              </TableCell>

              <TableCell className={cellClassName}>
                {payment.status === "failed" ? (
                  <span className="text-primary/30">—</span>
                ) : (
                  // Plain <a>: the route handler is outside the locale routes
                  <a
                    href={`/api/lawyer/emergency-receipts/${payment.id}`}
                    download
                    className="inline-flex items-center gap-1.5 text-primary hover:text-accent hover:underline"
                  >
                    <FileText className="size-4" aria-hidden="true" />
                    {t("downloadReceipt")}
                  </a>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </DataTable>
    </section>
  );
}
