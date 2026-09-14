"use client";

import { http } from "@/lib/http";
import { formatDate } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DataTable from "../../reusable/data-table";
import { Case } from "@/types/lawyer/browse-cases";
import { useUser } from "@/providers/user-provider";
import { useLocale, useTranslations } from "next-intl";
import UrgencyBadge from "../../reusable/urgency-label";
import { TableCell, TableRow } from "@/components/ui/table";

export default function RecentCases() {
  const { user } = useUser();
  const locale = useLocale();
  const t = useTranslations("Lawyer.Dashboard");
  const fontClass = locale === "en" ? "font-lora" : "";
  const [cases, setCases] = useState<Case[]>([]);
  const specializationIds =
    user?.lawyer_profile?.specializations.map((s) => s.id).join(",") || "";

  useEffect(() => {
    async function getCases() {
      try {
        const { data } = await http.get<{ data: Case[] }>("/api/lawyer/cases", {
          params: {
            specialization_id: specializationIds,
          },
        });
        setCases(data.data);
      } catch (error) {
        console.error("Failed to fetch cases:", error);
      }
    }

    getCases();
  }, [specializationIds]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <h3 className={`text-lg font-semibold text-primary ${fontClass}`}>
          {t("RecentCases")}
        </h3>

        <Link
          href="/lawyer/browse-cases"
          className="text-sm text-accent flex items-center gap-1"
        >
          {t("ViewAll")}
          <ArrowRight className="rtl:rotate-180 size-4" />
        </Link>
      </div>

      <DataTable
        columns={[
          t("CaseTitle"),
          t("Category"),
          t("Urgency"),
          t("Offers"),
          t("Posted"),
          t("Actions"),
        ]}
      >
        {cases.length === 0 ? (
          <TableRow>
            <TableCell className="px-5 py-3" colSpan={6}>
              <span className="text-primary/55">{t("NoCases")}</span>
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
                <UrgencyBadge
                  urgency={caseItem.urgency}
                  urgency_label={caseItem.urgency_label}
                />
              </TableCell>
              <TableCell className="px-5 py-3">
                <span className="font-medium">{caseItem.offers_count}</span>
              </TableCell>
              <TableCell className="px-5 py-3">
                <span className="text-primary/55">
                  {formatDate(caseItem.posted_at)}
                </span>
              </TableCell>
              <TableCell className="px-5 py-3 space-x-4">
                <Button
                  variant="ghost"
                  className="px-0 text-accent text-xs hover:bg-transparent hover:text-accent"
                  asChild
                >
                  <Link href={`/client/my-cases/${caseItem.id}`}>
                    <span>{t("View")}</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </DataTable>
    </div>
  );
}
