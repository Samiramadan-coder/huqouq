"use client";

import { cn, getTime } from "@/lib/utils";
import { Meta } from "@/types/shared";
import { Link } from "@/i18n/navigation";
import { Fragment, useState } from "react";
import { useFormatters } from "@/lib/format";
import { StatusBadge } from "./status-badge";
import DataTable from "../../reusable/data-table";
import { Emergency } from "@/types/client/emergency";
import { useLocale, useTranslations } from "next-intl";
import { DetailsPanel, toDuration } from "./details-panal";
import { TableCell, TableRow } from "@/components/ui/table";
import PaginationTemplate from "../../reusable/pagination-template";
import { Briefcase, ChevronDown, Phone, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function LawyerCell({ emergency }: { emergency: Emergency }) {
  const t = useTranslations("Client.EmergencyHistory");
  const lawyer = emergency.matched_lawyer;

  if (!lawyer) return <span className="text-primary/30">—</span>;

  // Named lawyer: shown once the client has started a case with them
  if (lawyer.name) {
    return (
      <div className="space-y-1">
        <p className="text-sm font-semibold text-primary">{lawyer.name}</p>
        {emergency.case_id && (
          <Link
            href={`/client/my-cases/${emergency.case_id}`}
            className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            <Briefcase className="size-3" aria-hidden="true" />
            {t("viewCase")}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <Avatar className="size-8 bg-primary">
        {lawyer.photo_url && <AvatarImage src={lawyer.photo_url} alt="" />}
        <AvatarFallback className="bg-primary text-accent">
          <ShieldCheck className="size-4" aria-hidden="true" />
        </AvatarFallback>
      </Avatar>
      <span className="text-sm text-primary/55">{t("anonymousLawyer")}</span>
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
  const t = useTranslations("Client.EmergencyHistory");
  const [openId, setOpenId] = useState<number | null>(null);

  const columns = [
    t("Table.dateTime"),
    t("Table.legalArea"),
    t("Table.emirate"),
    t("Table.lawyer"),
    t("Table.status"),
    t("Table.callLength"),
    t("Table.action"),
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
          emergency.map((item) => {
            const isOpen = openId === item.id;
            const detailsId = `emergency-details-${item.id}`;

            return (
              <Fragment key={item.id}>
                <TableRow
                  className={cn(
                    "border-secondary hover:bg-background/60",
                    isOpen && "bg-background/60 border-b-0",
                  )}
                >
                  <TableCell className="px-5 py-4 align-middle">
                    <p className="text-sm font-semibold text-primary">
                      {format.date(item.created_at)}
                    </p>
                    <p className="text-xs text-primary/40">
                      {getTime(item.created_at, locale)}
                    </p>
                  </TableCell>

                  <TableCell className={"text-primary px-5 py-4 align-middle"}>
                    {item.legal_area.name}
                  </TableCell>

                  <TableCell
                    className={"px-5 py-4 align-middle text-primary/55"}
                  >
                    {item.emirate_label}
                  </TableCell>

                  <TableCell className="px-5 py-4 align-middle">
                    <LawyerCell emergency={item} />
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
                      <span className="text-primary/30">—</span>
                    )}
                  </TableCell>

                  <TableCell className="px-5 py-4 align-middle">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={detailsId}
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="flex items-center gap-1 rounded-sm px-1 text-sm text-accent hover:underline focus-visible:outline focus-visible:outline-accent"
                    >
                      {isOpen ? t("hide") : t("details")}
                      <ChevronDown
                        className={cn(
                          "size-3.5 transition-transform",
                          isOpen && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  </TableCell>
                </TableRow>

                {isOpen && (
                  <TableRow
                    id={detailsId}
                    className="border-secondary bg-background/60 hover:bg-background/60"
                  >
                    <TableCell
                      colSpan={columns.length}
                      className="px-5 pb-5 pt-1"
                    >
                      <DetailsPanel emergency={item} />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })
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
