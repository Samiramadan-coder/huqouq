"use client";

import {
  Clock,
  FileText,
  Calendar,
  ChevronDown,
  CircleCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Meta } from "@/types/shared";
import { Fragment, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "../../reusable/data-table";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Earning } from "@/types/lawyer/my-earnings";
import { useTranslations } from "next-intl";
import { useEarningFormatters } from "./use-earning-formatters";
import PaginationTemplate from "../../reusable/pagination-template";

const COLUMNS_COUNT = 6;

// Share of the gross amount as a whole percentage, e.g. 90
const percentageOf = (part: number, whole: number) =>
  whole > 0 ? Math.round((part / whole) * 100) : 0;

export default function DataPreview({
  earnings,
  pagination,
}: {
  earnings: Earning[];
  pagination: Meta;
}) {
  const t = useTranslations("Lawyer.MyEarnings.Table");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <>
      <DataTable
        columns={[
          t("Source"),
          t("Client"),
          t("Date"),
          t("Amount"),
          t("Status"),
          "",
        ]}
      >
        {earnings.length === 0 ? (
          <TableRow>
            <TableCell className="px-5 py-3" colSpan={COLUMNS_COUNT}>
              <span className="text-primary/55">{t("NoEarnings")}</span>
            </TableCell>
          </TableRow>
        ) : (
          earnings.map((earning) => (
            <EarningRow
              key={earning.id}
              earning={earning}
              expanded={expandedId === earning.id}
              onToggle={() =>
                setExpandedId((current) =>
                  current === earning.id ? null : earning.id,
                )
              }
            />
          ))
        )}
      </DataTable>

      {pagination.last_page > 1 && (
        <PaginationTemplate
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
        />
      )}
    </>
  );
}

function EarningRow({
  earning,
  expanded,
  onToggle,
}: {
  earning: Earning;
  expanded: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations("Lawyer.MyEarnings.Table");
  const { money, percent, day } = useEarningFormatters();
  const detailsId = `earning-${earning.id}-details`;
  const hasPlatformFee = earning.platform_fee > 0;

  return (
    <Fragment>
      <TableRow className={cn("border-secondary", expanded && "border-b-0")}>
        <TableCell className="px-5 py-4">
          <SourceBadge earning={earning} />
          {earning.service_type_label && (
            <p className="mt-1.5 text-xs text-primary/45">
              {earning.service_type_label}
            </p>
          )}
        </TableCell>

        <TableCell className="px-5 py-4">
          <span className="text-sm text-primary/70 font-medium">
            {earning.client.first_name}
          </span>
        </TableCell>

        <TableCell className="px-5 py-4">
          <span className="text-sm text-primary/70 font-medium">
            {day(earning.date)}
          </span>
        </TableCell>

        <TableCell className="px-5 py-4">
          {hasPlatformFee ? (
            <>
              <p className="text-xs text-primary/45">
                {t("ServiceFee", {
                  amount: money(earning.gross, earning.currency),
                })}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-primary">
                {t("YourShare", {
                  percentage: percent(
                    percentageOf(earning.amount, earning.gross) / 100,
                  ),
                  amount: money(earning.amount, earning.currency),
                })}
              </p>
            </>
          ) : (
            <span className="text-sm font-semibold text-primary">
              {money(earning.amount, earning.currency)}
            </span>
          )}
        </TableCell>

        <TableCell className="px-5 py-4">
          <EarningStatus earning={earning} />
        </TableCell>

        <TableCell className="px-5 py-4 w-12">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-expanded={expanded}
            aria-controls={detailsId}
            aria-label={t("ToggleDetails")}
            className="size-8 text-primary/40 hover:bg-transparent hover:text-primary"
            onClick={onToggle}
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                expanded && "rotate-180",
              )}
            />
          </Button>
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow
          id={detailsId}
          className="border-secondary hover:bg-transparent"
        >
          <TableCell colSpan={COLUMNS_COUNT} className="px-0 pb-0 pt-0">
            <EarningDetails earning={earning} />
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
}

function SourceBadge({ earning }: { earning: Earning }) {
  const isConsultation = earning.type === "consultation";
  const Icon = isConsultation ? Calendar : FileText;

  return (
    <Badge
      className={cn(
        "rounded-full h-6 px-2.5 gap-1.5 text-xs font-semibold",
        isConsultation
          ? "bg-slate-100 text-slate-600 border-slate-200"
          : "bg-accent/10 text-accent border-accent/30",
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {earning.type_label}
    </Badge>
  );
}

function EarningStatus({ earning }: { earning: Earning }) {
  const t = useTranslations("Lawyer.MyEarnings.Table");
  const { day } = useEarningFormatters();

  const styles = {
    ready: {
      icon: CircleCheck,
      className: "bg-accent/10 text-accent border-accent/30",
    },
    paid: {
      icon: CircleCheck,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    pending: {
      icon: Clock,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
  }[earning.status];

  const Icon = styles.icon;

  const note =
    earning.status === "paid" && earning.paid_date
      ? t("PaidOn", { date: day(earning.paid_date) })
      : earning.status === "pending"
        ? earning.becomes_ready_on
          ? t("AvailableOn", { date: day(earning.becomes_ready_on) })
          : earning.pending_note
        : null;

  return (
    <div className="space-y-1">
      <Badge
        className={cn(
          "rounded-full h-6 min-w-36 justify-start px-2.5 gap-1.5 text-xs font-semibold",
          styles.className,
        )}
      >
        <Icon className="size-3" aria-hidden="true" />
        {earning.status_label}
      </Badge>
      {note && <p className="text-[11px] text-primary/40">{note}</p>}
    </div>
  );
}

function EarningDetails({ earning }: { earning: Earning }) {
  const t = useTranslations("Lawyer.MyEarnings.Table.Details");
  const { money, percent, day } = useEarningFormatters();
  const sharePercentage = percentageOf(earning.amount, earning.gross);

  const serviceDetails = [
    {
      label: t("Type"),
      value: earning.service_type_label ?? earning.type_label,
    },
    { label: t("Client"), value: earning.client.name },
    {
      label: t("PaidOn"),
      value: earning.paid_date && day(earning.paid_date),
    },
    { label: t("PayoutReference"), value: earning.paid_reference, ltr: true },
  ].filter((item) => item.value);

  return (
    <div className="bg-background px-5 sm:px-6 py-5 flex flex-col sm:flex-row gap-5 sm:gap-6">
      <section className="space-y-2 sm:pe-6 sm:border-e border-secondary">
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-primary/40">
          {t("ServiceDetails")}
        </h4>
        <dl className="space-y-1.5">
          {serviceDetails.map((item) => (
            <div key={item.label} className="flex gap-1 text-sm">
              <dt className="text-primary/45">{item.label}:</dt>
              <dd
                dir={item.ltr ? "ltr" : undefined}
                className="text-primary break-all"
              >
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-2 w-full sm:w-auto sm:min-w-72">
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-primary/40">
          {t("FeeBreakdown")}
        </h4>
        <dl className="space-y-1.5 text-sm">
          {earning.platform_fee > 0 && (
            <>
              <div className="flex items-center justify-between gap-6">
                <dt className="text-primary/45">{t("Gross")}</dt>
                <dd className="text-primary">
                  {money(earning.gross, earning.currency)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-6">
                <dt className="text-primary/45">
                  {t("PlatformFee", {
                    percentage: percent((100 - sharePercentage) / 100),
                  })}
                </dt>
                <dd className="text-primary/45">
                  − {money(earning.platform_fee, earning.currency)}
                </dd>
              </div>
            </>
          )}
          <div
            className={cn(
              "flex items-center justify-between gap-6 font-semibold",
              earning.platform_fee > 0 && "mt-2 pt-2 border-t border-secondary",
            )}
          >
            <dt className="text-primary">
              {earning.platform_fee > 0
                ? t("YourShare", { percentage: percent(sharePercentage / 100) })
                : t("YourEarnings")}
            </dt>
            <dd className="text-accent">
              {money(earning.amount, earning.currency)}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
