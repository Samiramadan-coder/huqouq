import { Meta } from "@/types/shared";
import { cn, formatDate } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";
import { CaseDetails } from "@/types/lawyer/my-cases";
import UrgencyBadge from "../../reusable/urgency-label";
import CaseStatusLabel from "../../reusable/case-status-label";
import PaginationTemplate from "../../reusable/pagination-template";
import { Briefcase, Calendar, MapPin, MoveRight } from "lucide-react";

export default async function ListOfCases({
  cases,
  pagination,
}: {
  cases: CaseDetails[];
  pagination: Meta;
}) {
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("Lawyer.MyCases");

  return (
    <div className="space-y-4">
      {cases.length > 0 ? (
        cases.map((caseItem) => (
          <Card
            key={caseItem.id}
            className={cn(
              "ring-0! rounded-xs border border-secondary",
              caseItem.display_status === "pending_fees" && "border-amber-200",
              caseItem.display_status === "pending_closure" &&
                "border-amber-200",
            )}
            style={{ boxShadow: "none" }}
          >
            <div className="flex flex-col sm:flex-row px-6">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <CaseStatusLabel
                    status={caseItem.display_status}
                    statusLabel={caseItem.display_status_label}
                  />
                  <UrgencyBadge
                    urgency={caseItem.urgency}
                    urgency_label={caseItem.urgency_label}
                  />
                  <Badge className="rounded-xs h-6 border-primary/15 bg-primary/5 text-primary">
                    {caseItem.specialization.name}
                  </Badge>
                </div>

                <h2
                  className={`mt-3 font-semibold text-lg wrap-break-word ltr:font-lora`}
                >
                  {caseItem.title}
                </h2>

                <div className="mt-2 flex items-start sm:items-center flex-col sm:flex-row flex-wrap gap-x-4 gap-y-2">
                  <span className="flex items-center gap-1 text-xs text-primary/40">
                    <MapPin className="size-3" aria-hidden="true" />{" "}
                    {caseItem.city}
                  </span>
                  {caseItem.client?.name && (
                    <span className="flex items-center gap-1 text-xs text-primary/40">
                      <Briefcase className="size-3" aria-hidden="true" />{" "}
                      {t("Client")}: {caseItem.client.name}
                    </span>
                  )}
                  {caseItem.hired_at && (
                    <span className="flex items-center gap-1 text-xs text-primary/40">
                      <Calendar className="size-3" aria-hidden="true" />{" "}
                      {t("Accepted")}: {formatDate(caseItem.hired_at)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-row flex-wrap sm:flex-col items-center gap-2">
                {caseItem.accepted_offer?.amount != null && (
                  <>
                    <p className="uppercase text-primary/40 text-xs">
                      {t("AgreedFee")}
                    </p>
                    <p
                      className={`text-primary font-semibold text-lg ltr:font-lora`}
                    >
                      {tCommon("AED")} {caseItem.accepted_offer.amount}
                    </p>
                  </>
                )}
                <Link
                  className="underline text-xs text-amber-700 flex items-center gap-1 whitespace-nowrap ms-auto sm:ms-0"
                  href={`/lawyer/browse-cases/${caseItem.id}`}
                >
                  {t("ViewCase")}
                  <MoveRight
                    className="size-3 rtl:rotate-180"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>

            {caseItem.display_status === "pending_fees" && (
              <div className="font-semibold border-t border-amber-200 text-amber-800 px-6 pt-4">
                {t("PendingFeeWarnings")}
              </div>
            )}

            {caseItem.display_status === "pending_closure" && (
              <div className="font-semibold border-t border-amber-200 text-amber-800 px-6 pt-4">
                {t("PendingClosure")}
              </div>
            )}
          </Card>
        ))
      ) : (
        <p className="text-sm text-primary/50">{t("NoCasesFound")}</p>
      )}

      {pagination.last_page > 1 && (
        <PaginationTemplate
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
        />
      )}
    </div>
  );
}
