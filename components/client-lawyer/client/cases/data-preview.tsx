import { Meta } from "@/types/shared";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Case } from "@/types/client/cases";
import { Button } from "@/components/ui/button";
import DataTable from "../../reusable/data-table";
import { getTranslations } from "next-intl/server";
import { TableCell, TableRow } from "@/components/ui/table";
import CaseStatusLabel from "../../reusable/case-status-label";
import PaginationTemplate from "../../reusable/pagination-template";
import PublishCase from "./publish-case";

export default async function DataPreview({
  cases,
  pagination,
}: {
  cases: Case[];
  pagination?: Meta;
}) {
  return <CasesTable cases={cases} pagination={pagination} />;
}

export async function CasesTable({
  cases,
  pagination,
}: {
  cases: Case[];
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
                <CaseStatusLabel
                  status={caseItem.display_status}
                  statusLabel={caseItem.display_status_label}
                />
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
                {caseItem.display_status !== "rejected" &&
                  caseItem.display_status !== "request_declined" &&
                  caseItem.display_status !== "awaiting_lawyer" && (
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

                {caseItem.display_status === "request_declined" && (
                  <>
                    <PublishCase caseId={caseItem.id} />
                    {/* <Button
                      variant="ghost"
                      className="px-0 text-emerald-700 text-xs hover:bg-transparent hover:text-accent"
                    >
                      Publish
                      <ArrowRight className="size-3" />
                    </Button> */}
                  </>
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
