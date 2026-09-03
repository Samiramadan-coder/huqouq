import { Meta } from "@/types/shared";
import { formatDate } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import ListOfCasesHeader from "./list-of-cases-header";
import UrgencyBadge from "../../reusable/urgency-label";
import { Card, CardContent } from "@/components/ui/card";
import { CaseDetails, Filters } from "@/types/lawyer/browse-cases";
import { ChevronRight, Clock, MapPin } from "lucide-react";

export default async function ListOfCases({
  cases,
  pagination,
  can_submit_offer,
  filters,
}: {
  cases: CaseDetails[];
  pagination: Meta;
  can_submit_offer: boolean;
  filters: Filters;
}) {
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("Lawyer.BrowseCases");

  return (
    <div className="space-y-3">
      <ListOfCasesHeader total={pagination.total} filters={filters} />

      {cases.map((caseItem) => (
        <Card
          key={caseItem.id}
          className="rounded-xs ring-0! border border-secondary"
        >
          <CardContent>
            <div className="flex gap-2 mb-3">
              <Badge className="h-6 bg-background text-[11px] text-primary/60 border border-secondary rounded-xs">
                {caseItem.specialization.name}
              </Badge>
              <UrgencyBadge
                urgency={caseItem.urgency}
                urgency_label={caseItem.urgency_label}
              />
            </div>

            <h3 className="font-semibold text-[15px] text-primary mb-2">
              {caseItem.title}
            </h3>

            <p className="text-sm mb-2 text-primary/55">
              {caseItem.description}
            </p>

            <div className="flex items-center flex-wrap gap-4 mb-4">
              <p className="text-sm font-semibold text-accent">
                {tCommon("AED")} {caseItem.budget_min} - {caseItem.budget_max}
              </p>

              <div className="flex items-center gap-1 text-xs text-primary/50">
                <MapPin className="size-3" />
                {caseItem.city}
              </div>

              <div className="flex items-center gap-1 text-xs text-primary/50">
                <Clock className="size-3" />
                {formatDate(caseItem.posted_at)}
              </div>
            </div>

            <div className="border-t border-secondary pt-4 flex items-center justify-between">
              <p className="text-xs text-primary/40">
                {t("lawyersHaveOffers")}
              </p>

              {can_submit_offer && (
                <Button
                  asChild
                  variant="outline"
                  className="h-10 border border-secondary text-xs rounded-xs bg-white text-primary hover:text-primary hover:bg-transparent"
                >
                  <Link href={`/lawyer/browse-cases/${caseItem.id}`}>
                    {t("ViewDetails")}
                    <ChevronRight />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
