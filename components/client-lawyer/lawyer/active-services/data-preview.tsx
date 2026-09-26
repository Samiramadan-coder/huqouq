import { Meta } from "@/types/shared";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "../../reusable/data-table";
import { getTranslations } from "next-intl/server";
import { Service } from "@/types/lawyer/active-services";
import { TableCell, TableRow } from "@/components/ui/table";
import PaginationTemplate from "../../reusable/pagination-template";

export default async function DataPreview({
  services,
  pagination,
}: {
  services: Service[];
  pagination?: Meta;
}) {
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("Lawyer.ActiveServices");

  return (
    <>
      <DataTable
        columns={[
          t("Table.serviceType"),
          t("Table.client"),
          t("Table.agreedFee"),
          t("Table.deadLine"),
          t("Table.status"),
          t("Table.actions"),
        ]}
      >
        {services.length === 0 ? (
          <TableRow>
            <TableCell className="px-5 py-3" colSpan={7}>
              <span className="text-primary/55">{t("Table.noServices")}</span>
            </TableCell>
          </TableRow>
        ) : (
          services.map((service, index) => (
            <TableRow key={index} className="border-secondary">
              <TableCell className="px-5 py-3">
                <span className="text-sm text-primary font-medium">
                  {service.service_type_label}
                </span>
              </TableCell>
              <TableCell className="px-5 py-3">
                <span className="text-sm text-primary/70 font-medium">
                  {service.client.first_name}
                </span>
              </TableCell>
              <TableCell className="px-5 py-3">
                <span className="text-sm text-primary font-medium">
                  {tCommon("AED")} {service.agreed_fee}
                </span>
              </TableCell>
              <TableCell className="px-5 py-3">
                <span className="text-sm text-primary/70 font-medium">
                  {formatDate(service.deadline)}
                </span>
              </TableCell>

              <TableCell className="px-5 py-3">
                <OfferStatus
                  status={service.status}
                  statusLabel={service.status_label}
                />
              </TableCell>
              <TableCell className="px-5 py-3 space-x-4">
                <Button
                  variant="ghost"
                  className="px-0 text-accent text-xs hover:bg-transparent hover:text-accent"
                  asChild
                >
                  <Link href={`/lawyer/services/${service.id}`}>
                    <span>{t("view")}</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </DataTable>

      {pagination && (
        <PaginationTemplate
          currentPage={pagination?.current_page}
          totalPages={pagination?.last_page}
        />
      )}
    </>
  );
}

async function OfferStatus({
  status,
  statusLabel,
}: {
  status: Service["status"];
  statusLabel: string;
}) {
  switch (status) {
    case "in_progress":
      return (
        <Badge className="rounded-xs text-xs py-3 font-normal bg-amber-50 text-amber-700 border-amber-200">
          {statusLabel}
        </Badge>
      );

    case "completed":
      return (
        <Badge className="rounded-xs text-xs py-3 font-normal bg-emerald-50 text-emerald-700 border-emerald-200">
          {statusLabel}
        </Badge>
      );

    case "delivered":
      return (
        <Badge className="rounded-xs text-xs py-3 font-normal bg-[#F7F5F0] text-primary/40 border-[#EDE9E1]">
          {statusLabel}
        </Badge>
      );

    default:
      return (
        <Badge className="rounded-xs text-xs py-3 font-normal bg-[#F7F5F0] text-primary/40 border-[#EDE9E1]">
          {statusLabel}
        </Badge>
      );
  }
}
