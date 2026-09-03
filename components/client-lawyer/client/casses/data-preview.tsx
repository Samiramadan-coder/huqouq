import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
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
                  <Link href={`/client/cases/${caseItem.id}`}>
                    <span>{t("view")}</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </Button>
              )}

              {["pending_review", "rejected"].includes(caseItem.status) && (
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

export function CaseStatus({ caseItem }: { caseItem: CaseDetails }) {
  return (
    <Badge
      className={cn(
        "rounded-sm text-[11px] h-6.5 font-normal",
        caseItem.status === "pending_review" &&
          "bg-accent/10 border-accent/25 text-accent",
        caseItem.status === "approved" &&
          "bg-primary/5 border-primary/20 text-primary",
        caseItem.status === "rejected" &&
          "bg-destructive/10 border-destructive/15 text-destructive",
        caseItem.status === "rejected" &&
          "bg-destructive/10 border-destructive/15 text-destructive",
        caseItem.status === "has_offers" &&
          "bg-green-100 border-green-300 text-green-700",
        caseItem.status === "hired" &&
          "bg-accent/10 border-accent/25 text-accent",
      )}
    >
      {caseItem.status_label}
    </Badge>
  );
}
