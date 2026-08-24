import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "../../reusable/data-table";
import { getTranslations } from "next-intl/server";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";

export default async function DataPreview() {
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
      {Array.from({ length: 10 }).map((_, index) => (
        <TableRow key={index} className="border-secondary">
          <TableCell className="px-5 py-3">
            <span className="font-medium">Employment Contract Dispute</span>
          </TableCell>
          <TableCell className="px-5 py-3">
            <span className="text-primary/55">Labor Law</span>
          </TableCell>
          <TableCell className="px-5 py-3">
            <Badge className="rounded-sm text-[11px] bg-accent/10 border border-accent/40 text-accent font-normal">
              Has Offers
            </Badge>
          </TableCell>
          <TableCell className="px-5 py-3">
            <span className="font-medium">3</span>
          </TableCell>
          <TableCell className="px-5 py-3">
            <span className="text-primary/55">18 Jun 2025</span>
          </TableCell>
          <TableCell className="px-5 py-3">
            <Link href="/client/cases/1">
              <Button
                variant="ghost"
                className="text-accent text-xs hover:bg-transparent hover:text-accent"
              >
                <span>{t("view")}</span>
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </TableCell>
        </TableRow>
      ))}
    </DataTable>
  );
}
