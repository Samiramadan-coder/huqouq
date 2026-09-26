import { Meta } from "@/types/shared";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "../../reusable/data-table";
import { getTranslations } from "next-intl/server";
import { Offer } from "@/types/lawyer/service-offers";
import { TableCell, TableRow } from "@/components/ui/table";
import PaginationTemplate from "../../reusable/pagination-template";

export default async function DataPreview({
  offers,
  pagination,
}: {
  offers: Offer[];
  pagination?: Meta;
}) {
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("Lawyer.ServiceOffers");

  return (
    <>
      <DataTable
        columns={[
          t("Table.serviceType"),
          t("Table.client"),
          t("Table.proposedFee"),
          t("Table.deliveryTime"),
          t("Table.submitted"),
          t("Table.status"),
          t("Table.actions"),
        ]}
      >
        {offers.length === 0 ? (
          <TableRow>
            <TableCell className="px-5 py-3" colSpan={7}>
              <span className="text-primary/55">{t("Table.noOffers")}</span>
            </TableCell>
          </TableRow>
        ) : (
          offers.map((offer, index) => (
            <TableRow key={index} className="border-secondary">
              <TableCell className="px-5 py-3">
                <span className="text-sm text-primary font-medium">
                  {offer.request.service_type_label}
                </span>
              </TableCell>
              <TableCell className="px-5 py-3">
                <span className="text-sm text-primary/70 font-medium">
                  {offer.request.client_first_name}
                </span>
              </TableCell>
              <TableCell className="px-5 py-3">
                <span className="text-sm text-primary font-medium">
                  {tCommon("AED")} {offer.fee}
                </span>
              </TableCell>
              <TableCell className="px-5 py-3">
                <span className="text-sm text-primary/70 font-medium">
                  {offer.delivery_time_label}
                </span>
              </TableCell>
              <TableCell className="px-5 py-3">
                <span className="text-xs text-primary/70 font-medium">
                  {formatDate(offer.created_at)}
                </span>
              </TableCell>
              <TableCell className="px-5 py-3">
                <OfferStatus
                  status={offer.status}
                  statusLabel={offer.status_label}
                />
              </TableCell>
              <TableCell className="px-5 py-3 space-x-4">
                <Button
                  variant="ghost"
                  className="px-0 text-accent text-xs hover:bg-transparent hover:text-accent"
                  asChild
                >
                  <Link href={`/lawyer/services/${offer.request.id}`}>
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
  status: Offer["status"];
  statusLabel: string;
}) {
  switch (status) {
    case "pending":
      return (
        <Badge className="rounded-xs text-xs py-3 font-normal bg-amber-50 text-amber-700 border-amber-200">
          {statusLabel}
        </Badge>
      );

    case "accepted":
      return (
        <Badge className="rounded-xs text-xs py-3 font-normal bg-emerald-50 text-emerald-700 border-emerald-200">
          {statusLabel}
        </Badge>
      );

    case "rejected":
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
