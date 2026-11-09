"use client";

import { getTime } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Meta } from "@/types/shared";
import { useFormatters } from "@/lib/format";
import { StatusBadge } from "./status-badge";
import { Briefcase, Phone } from "lucide-react";
import DataTable from "../../reusable/data-table";
import { useLocale, useTranslations } from "next-intl";
import { TableCell, TableRow } from "@/components/ui/table";
import { Emergency } from "@/types/lawyer/emergency-history";
import PaginationTemplate from "../../reusable/pagination-template";
import { toDuration } from "../../client/emergency/details-panal";

const empty = <span className="text-primary/30">—</span>;

function OutcomeCell({ emergency }: { emergency: Emergency }) {
  const t = useTranslations("Lawyer.EmergencyHistory");

  if (!emergency.outcome_label) return empty;

  return (
    <div className="space-y-1.5">
      <Badge
        variant="outline"
        className="rounded-full border-secondary bg-secondary/30 px-2.5 text-xs font-medium text-primary/75"
      >
        {emergency.outcome_label}
      </Badge>
      {emergency.converted ? (
        // There's no single-case page for lawyers; the list holds the case
        <Link
          href="/lawyer/my-cases"
          className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
        >
          <Briefcase className="size-3" aria-hidden="true" />
          {t("convertedToCase")}
        </Link>
      ) : (
        <p className="text-xs text-primary/30">{t("notConverted")}</p>
      )}
    </div>
  );
}

export default function DataPreview({
  emergency,
  pagination,
}: {
  emergency: Emergency[];
  pagination: Meta;
}) {
  const locale = useLocale();
  const format = useFormatters();
  const t = useTranslations("Lawyer.EmergencyHistory");

  const columns = [
    t("Table.dateTime"),
    t("Table.legalArea"),
    t("Table.emirate"),
    t("Table.client"),
    t("Table.status"),
    t("Table.callLength"),
    t("Table.outcome"),
  ];

  return (
    <>
      <DataTable columns={columns}>
        {emergency.length === 0 ? (
          <TableRow>
            <TableCell className="px-5 py-3" colSpan={columns.length}>
              <span className="text-primary/55">{t("noRequests")}</span>
            </TableCell>
          </TableRow>
        ) : (
          emergency.map((item) => (
            <TableRow
              key={item.id}
              className="border-secondary hover:bg-background/60"
            >
              <TableCell className="px-5 py-4 align-middle text-sm font-medium text-primary">
                {format.date(item.created_at)},{" "}
                {getTime(item.created_at, locale)}
              </TableCell>

              <TableCell className="px-5 py-4 align-middle whitespace-normal text-primary">
                {item.legal_area.name}
              </TableCell>

              <TableCell className="px-5 py-4 align-middle text-primary/55">
                {item.emirate_label}
              </TableCell>

              <TableCell className="px-5 py-4 align-middle font-semibold text-primary">
                {item.client_first_name}
              </TableCell>

              <TableCell className="px-5 py-4 align-middle">
                <StatusBadge emergency={item} />
              </TableCell>

              <TableCell className="px-5 py-4 align-middle">
                {item.call.call_seconds ? (
                  <span className="flex items-center gap-1.5 text-primary/55">
                    <Phone className="size-3.5" aria-hidden="true" />
                    {format.digits(toDuration(item.call.call_seconds))}
                  </span>
                ) : (
                  empty
                )}
              </TableCell>

              <TableCell className="px-5 py-4 align-middle">
                <OutcomeCell emergency={item} />
              </TableCell>
            </TableRow>
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
