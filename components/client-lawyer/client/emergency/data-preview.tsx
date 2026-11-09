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
import RequestEmergencyHelp from "./request-emergency/request-emergency-help";
import { TableCell, TableRow } from "@/components/ui/table";
import PaginationTemplate from "../../reusable/pagination-template";
import {
  Phone,
  Briefcase,
  BadgeCheck,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function LawyerCell({ emergency }: { emergency: Emergency }) {
  const t = useTranslations("Client.EmergencyHistory");
  const matched = emergency.matched_lawyer;

  if (!matched) return <span className="text-primary/30">—</span>;

  // Anonymous until the emergency became a case; only then named
  const lawyer = emergency.case_id
    ? matched
    : { ...matched, name: undefined, photo_url: undefined };
  const name = lawyer.name || t("anonymousLawyer");
  const details = [lawyer.based_in, lawyer.experience_range]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex items-center gap-2.5">
      <Avatar className="size-8 shrink-0 bg-primary">
        {lawyer.photo_url && <AvatarImage src={lawyer.photo_url} alt={name} />}
        <AvatarFallback className="bg-primary text-accent">
          {lawyer.name ? (
            lawyer.name[0]
          ) : (
            <ShieldCheck className="size-4" aria-hidden="true" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-0.5">
        <p
          className={cn(
            "flex items-center gap-1 text-sm",
            lawyer.name ? "font-semibold text-primary" : "text-primary/70",
          )}
        >
          {name}
          {lawyer.verified && (
            <BadgeCheck
              className="size-3.5 text-green-700"
              aria-label={t("verified")}
            />
          )}
        </p>
        {details && <p className="text-xs text-primary/40">{details}</p>}
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
            <TableCell className="px-5 py-10" colSpan={columns.length}>
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="text-primary/55">{t("noRequests")}</span>
                <RequestEmergencyHelp triggerLabel={t("getEmergencyHelp")} />
              </div>
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
