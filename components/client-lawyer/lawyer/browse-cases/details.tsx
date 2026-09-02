import Title from "../../reusable/title";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import BackBtn from "../../reusable/back-btn";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import UrgencyBadge from "../../reusable/urgency-label";
import { CaseDetails } from "@/types/lawyer/browse-cases";

export default async function Details({
  caseDetails,
}: {
  caseDetails: CaseDetails;
}) {
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("Lawyer.BrowseCases");

  return (
    <div className="space-y-6">
      <BackBtn>
        <span>{t("BackToCases")}</span>
      </BackBtn>

      <div>
        <Title>{caseDetails.title}</Title>

        <div className="flex gap-2 mb-3 mt-1">
          <Badge className="h-6 bg-background text-[11px] text-primary/60 border border-secondary rounded-xs">
            {caseDetails.specialization.name}
          </Badge>
          <UrgencyBadge
            urgency={caseDetails.urgency}
            urgency_label={caseDetails.urgency_label}
          />
        </div>
      </div>

      <div className="flex gap-5">
        <div className="flex-1 space-y-3">
          <Card className="p-0 rounded-xs ring-0! border border-secondary">
            <div className="p-5"></div>
          </Card>

          <Card className="p-0 rounded-xs ring-0! border border-secondary">
            <div className="p-5"></div>
          </Card>

          <Card className="p-0 rounded-xs ring-0! border border-secondary">
            <div className="p-5"></div>
          </Card>
        </div>

        <div className="w-75">
          <Card className="p-0 rounded-xs ring-0! border border-secondary">
            <div className="p-5">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-4">
                {t("CaseSummary")}
              </p>

              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-[10px] text-primary/35 uppercase tracking-widest">
                    {t("Category")}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {caseDetails.specialization.name}
                  </p>
                </div>
                <Separator className="bg-secondary" />

                <div>
                  <p className="text-[10px] text-primary/35 uppercase tracking-widest">
                    {t("Location")}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="size-3 text-primary/35" />
                    <p className="text-sm font-medium text-primary">
                      {caseDetails.city}
                    </p>
                  </div>
                </div>
                <Separator className="bg-secondary" />

                <div>
                  <p className="text-[10px] text-primary/35 uppercase tracking-widest">
                    {t("Posted")}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="size-3 text-primary/35" />
                    <p className="text-sm font-medium text-primary">
                      {formatDate(caseDetails.posted_at)}
                    </p>
                  </div>
                </div>
                <Separator className="bg-secondary" />

                <div>
                  <p className="text-[10px] text-primary/35 uppercase tracking-widest">
                    {t("Budget")}
                  </p>
                  <p className="text-sm text-accent font-semibold mt-1">
                    {tCommon("AED")} {caseDetails.budget_min} -{" "}
                    {caseDetails.budget_max}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-primary/35 uppercase tracking-widest mb-1">
                    {t("Urgency")}
                  </p>
                  <UrgencyBadge
                    urgency={caseDetails.urgency}
                    urgency_label={caseDetails.urgency_label}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
