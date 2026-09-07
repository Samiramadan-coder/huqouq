import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "../../reusable/data-table";
import { getTranslations } from "next-intl/server";
import { CaseDetails } from "@/types/client/cases";
import { TableCell, TableRow } from "@/components/ui/table";
import { Meta } from "@/types/shared";
import PaginationTemplate from "../../reusable/pagination-template";

export default async function DataPreview({
  cases,
  pagination,
}: {
  cases: CaseDetails[];
  pagination?: Meta;
}) {
  return <CasesTable cases={cases} pagination={pagination} />;
}

// The CasesTable component is defined below and is used to render the table of cases.
export async function CasesTable({
  cases,
  pagination,
}: {
  cases: CaseDetails[];
  pagination?: Meta;
}) {
  const t = await getTranslations("Client.Cases");

  return (
    <>
      <DataTable
        columns={[
          t("Table.title"),
          t("Table.category"),
          t("Table.status"),
          t("Table.offers"),
          t("Table.posted"),
          t("Table.actions"),
        ]}
      >
        {cases.length === 0 ? (
          <TableRow>
            <TableCell className="px-5 py-3" colSpan={6}>
              <span className="text-primary/55">{t("noCases")}</span>
            </TableCell>
          </TableRow>
        ) : (
          cases.map((caseItem, index) => (
            <TableRow key={index} className="border-secondary">
              <TableCell className="px-5 py-3">
                <span className="font-medium">{caseItem.title}</span>
              </TableCell>
              <TableCell className="px-5 py-3">
                <span className="text-primary/55">
                  {caseItem.specialization.name}
                </span>
              </TableCell>
              <TableCell className="px-5 py-3">
                <CaseStatus caseItem={caseItem} />
              </TableCell>
              <TableCell className="px-5 py-3">
                <span className="font-medium">{caseItem.offers_count}</span>
              </TableCell>
              <TableCell className="px-5 py-3">
                <span className="text-primary/55">
                  {formatDate(caseItem.created_at)}
                </span>
              </TableCell>
              <TableCell className="px-5 py-3 space-x-4">
                {caseItem.status !== "rejected" && (
                  <Button
                    variant="ghost"
                    className="px-0 text-accent text-xs hover:bg-transparent hover:text-accent"
                    asChild
                  >
                    <Link href={`/client/my-cases/${caseItem.id}`}>
                      <span>{t("view")}</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </Button>
                )}

                {caseItem.can_edit && (
                  <Button
                    variant="ghost"
                    className="px-0 text-primary text-xs hover:bg-transparent hover:text-accent"
                    asChild
                  >
                    <Link href={`/client/my-cases/edit/${caseItem.id}`}>
                      <span>{t("editCase")}</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </Button>
                )}
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

// CaseStatus and CasesTable components are defined below,
export function CaseStatus({ caseItem }: { caseItem: CaseDetails }) {
  switch (caseItem.display_status) {
    case "pending_review":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-accent/10 border-accent/25 text-accent">
          {caseItem.display_status_label}
        </Badge>
      );

    case "pending_closure":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-accent/10 border-accent/25 text-accent">
          {caseItem.display_status_label}
        </Badge>
      );

    case "in_progress":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-primary/5 border-primary/20 text-primary">
          {caseItem.display_status_label}
        </Badge>
      );

    case "published":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-primary/5 border-primary/20 text-primary">
          {caseItem.display_status_label}
        </Badge>
      );

    case "pending_fees":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-accent/10 border-accent/25 text-accent">
          {caseItem.display_status_label}
        </Badge>
      );

    case "has_offers":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-green-100 border-green-300 text-green-700">
          {caseItem.display_status_label}
        </Badge>
      );

    case "hired":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-accent/10 border-accent/25 text-accent">
          {caseItem.display_status_label}
        </Badge>
      );

    case "closed":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-primary/5 border-primary/20 text-primary">
          {caseItem.display_status_label}
        </Badge>
      );

    case "rejected":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-destructive/10 border-destructive/15 text-destructive">
          {caseItem.display_status_label}
        </Badge>
      );

    default:
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-primary/5 border-primary/20 text-primary">
          {caseItem.display_status_label}
        </Badge>
      );
  }
}
