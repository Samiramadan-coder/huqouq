"use client";

import { http } from "@/lib/http";
import { formatDate } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DataTable from "../../reusable/data-table";
import { Case } from "@/types/lawyer/browse-cases";
import { useUser } from "@/providers/user-provider";
import { useTranslations } from "next-intl";
import UrgencyBadge from "../../reusable/urgency-label";
import { TableCell, TableRow } from "@/components/ui/table";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";

export default function RecentCases() {
  const { user } = useUser();
  const t = useTranslations("Lawyer.Dashboard");
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      } finally {
        setIsLoading(false);
      }
    }

    getCases();
  }, [specializationIds]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className={`text-lg font-semibold text-primary ltr:font-lora`}>
          {t("RecentCases")}
        </h3>

        <Link
          href="/lawyer/browse-cases"
          className="text-sm text-accent flex items-center gap-1 ms-auto"
        >
          {t("ViewAll")}
          <ArrowRight className="rtl:rotate-180 size-4" />
        </Link>
      </div>

      {!isLoading && cases.length === 0 ? (
        <div className="rounded-sm border border-dashed border-secondary bg-white px-6 py-10 flex flex-col items-center text-center gap-3">
          <div className="size-12 rounded-full bg-accent/10 flex items-center justify-center">
            <BriefcaseBusiness
              className="size-5 text-accent"
              aria-hidden="true"
            />
          </div>
          <div className="space-y-1">
            <p className={`font-semibold text-primary ltr:font-lora`}>
              {t("NoCases")}
            </p>
            <p className="text-sm text-primary/55 max-w-sm">
              {t("NoCasesDescription")}
            </p>
          </div>
          <Link
            href="/lawyer/browse-cases"
            className="text-sm text-accent flex items-center gap-1"
          >
            {t("ViewAll")}
            <ArrowRight className="rtl:rotate-180 size-4" />
          </Link>
        </div>
      ) : (
        <DataTable
          columns={[
            t("CaseTitle"),
            t("Category"),
            t("Urgency"),
            t("Offers"),
            t("Posted"),
            ...(user?.lawyer_profile?.profile_status === "approved"
              ? [t("Actions")]
              : []),
          ]}
        >
          {cases.map((caseItem, index) => (
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
              {user?.lawyer_profile?.profile_status === "approved" && (
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
              )}
            </TableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
}
