import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { CaseDetails } from "@/types/lawyer/browse-cases";
import { ChevronRight, Clock, MapPin, TriangleAlert, Zap } from "lucide-react";
import ListOfCasesHeader from "./list-of-cases-header";
import { Meta } from "@/types/shared";

export default async function ListOfCases({
  cases,
  pagination,
}: {
  cases: CaseDetails[];
  pagination: Meta;
}) {
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("Lawyer.BrowseCases");

  return (
    <div className="space-y-3">
      <ListOfCasesHeader total={pagination.total} />

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

              <Badge
                className={cn(
                  "h-6 text-[11px] border rounded-xs",
                  caseItem.urgency === "urgent" &&
                    "bg-amber-50 text-amber-700 border-amber-200",
                  caseItem.urgency === "very_urgent" &&
                    "bg-destructive/10 text-destructive border-destructive/60",
                  caseItem.urgency === "standard" &&
                    "bg-background text-primary/60 border-secondary",
                )}
              >
                {caseItem.urgency === "urgent" && <TriangleAlert />}
                {caseItem.urgency === "very_urgent" && <Zap />}
                {caseItem.urgency_label}
              </Badge>
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

              <Button
                variant="outline"
                className="h-10 border border-secondary text-xs rounded-xs bg-white text-primary hover:text-primary hover:bg-transparent"
              >
                {t("ViewDetails")}
                <ChevronRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
