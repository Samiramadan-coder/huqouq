import { Meta } from "@/types/shared";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CaseDetails } from "@/types/lawyer/my-cases";
import UrgencyBadge from "../../reusable/urgency-label";
import { Briefcase, Calendar, MapPin, MoveRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import PaginationTemplate from "../../reusable/pagination-template";
import CaseStatusLabel from "../../reusable/case-status-label";
import { Link } from "@/i18n/navigation";

export default async function ListOfCases({
  cases,
  pagination,
}: {
  cases: CaseDetails[];
  pagination: Meta;
}) {
  const locale = await getLocale();
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("Lawyer.MyCases");
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <div className="space-y-4">
      {cases.length > 0 ? (
        cases.map((caseItem) => (
          <Card
            key={caseItem.id}
            className="ring-0! rounded-xs border border-secondary sm:flex-row gap-4 px-6"
            style={{ boxShadow: "none" }}
          >
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
                className={`mt-3 font-semibold text-lg wrap-break-word ${fontClass}`}
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
                    className={`text-primary font-semibold text-lg ${fontClass}`}
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
