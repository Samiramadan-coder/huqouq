import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "../../reusable/data-table";
import { getTranslations } from "next-intl/server";
import { CaseDetails } from "@/types/client/cases";
import { TableCell, TableRow } from "@/components/ui/table";

export default async function DataPreview({ cases }: { cases: CaseDetails[] }) {
  const t = await getTranslations("Client.Cases");

  return (
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
              <Badge className="rounded-sm text-[11px] bg-accent/10 border border-accent/40 text-accent font-normal">
                {caseItem.status_label}
              </Badge>
            </TableCell>
            <TableCell className="px-5 py-3">
              <span className="font-medium">-</span>
            </TableCell>
            <TableCell className="px-5 py-3">
              <span className="text-primary/55">
                {formatDate(caseItem.created_at)}
              </span>
            </TableCell>
            <TableCell className="px-5 py-3 space-x-4">
              <Button
                variant="ghost"
                className="px-0 text-accent text-xs hover:bg-transparent hover:text-accent"
                asChild
              >
                <Link href={`/client/cases/${caseItem.id}`}>
                  <span>{t("view")}</span>
                  <ArrowRight className="size-3" />
                </Link>
              </Button>

              {caseItem.status === "pending_review" && (
                <Button
                  variant="ghost"
                  className="px-0 text-primary text-xs hover:bg-transparent hover:text-accent"
                  asChild
                >
                  <Link href={`/client/cases/edit/${caseItem.id}`}>
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
  );
}
