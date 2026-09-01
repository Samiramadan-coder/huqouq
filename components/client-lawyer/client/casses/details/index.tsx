import {
  Tag,
  MapPin,
  FileText,
  CalendarDays,
  TriangleAlert,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import InfoRow from "./info-row";
import { Link } from "@/i18n/navigation";
import { cn, formatDate } from "@/lib/utils";
import TimelineRail from "./timeline-radial";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CaseDetails } from "@/types/client/cases";
import { Separator } from "@/components/ui/separator";
import { getLocale, getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Index({
  caseDetails,
}: {
  caseDetails: CaseDetails;
}) {
  const locale = await getLocale();
  const t = await getTranslations("Client.Cases");
  const tCommon = await getTranslations("Common");
  const fontClass = locale === "en" ? "font-lora" : "";
  const currentStep = getCurrentStep();

  function getCurrentStep() {
    switch (caseDetails.status) {
      case "pending_review":
        return 0;
      case "approved":
        return 1;
      default:
        return 2;
    }
  }

  const timeline = [
    {
      id: "posted",
      title: t("Timeline.Posted"),
      description: t("PostedOn", {
        date: formatDate(caseDetails.created_at),
      }),
    },
    {
      id: "approved",
      title: t("Timeline.Approved"),
      description: t("ReviewedOn", {
        date: formatDate(caseDetails.reviewed_at || ""),
      }),
    },
    {
      id: "offers",
      title: t("Timeline.OffersReceived"),
      description: "",
    },
    {
      id: "hired",
      title: t("Timeline.Hired"),
      description: "",
    },
    {
      id: "progress",
      title: t("Timeline.InProgress"),
      description: "",
    },
    {
      id: "closure",
      title: t("Timeline.PendingClosure"),
      description: "",
    },
    {
      id: "closed",
      title: t("Timeline.Closed"),
      description: "",
    },
    {
      id: "reviewed",
      title: t("Timeline.Reviewed"),
      description: "",
    },
  ];

  return (
    <>
      <BackBtn>
        <span>{t("backToCases")}</span>
      </BackBtn>

      <div>
        <div className="flex items-center justify-between gap-4">
          <Title>{caseDetails.title}</Title>

          <div className="space-x-2">
            {caseDetails.status === "pending_review" ||
              (caseDetails.status === "rejected" && (
                <Button
                  variant="outline"
                  className="rounded-sm border-secondary font-normal text-xs text-primary/55"
                  asChild
                >
                  <Link href={`/client/cases/edit/${caseDetails.id}`}>
                    {t("editCase")}
                  </Link>
                </Button>
              ))}

            {/* <Button
              variant="outline"
              className="rounded-sm border-secondary font-normal text-xs text-destructive"
            >
              {t("closeCase")}
            </Button> */}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <Badge className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-2 h-6">
            {caseDetails.status_label}
          </Badge>
          <Badge className="text-accent bg-accent/10 border border-accent/30 px-2.5 py-2 h-6 rounded-sm">
            {t(caseDetails.urgency)}
          </Badge>
          {/* <div className="flex items-center gap-1">
            <Eye className="text-primary/35 size-3.5" />
            <span className="text-primary/35 text-xs">47 Views</span>
          </div> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="w-full md:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className={cn("text-sm font-semibold", fontClass)}>
              {t("caseStatusTimeline")}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Accordion
              type="multiple"
              defaultValue={[timeline[currentStep].id]}
              className="w-full"
            >
              {timeline.map((item, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const isPending = index > currentStep;
                const isEnabled = index <= currentStep;
                const isLast = index === timeline.length - 1;

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[20px_minmax(0,1fr)] gap-x-3"
                  >
                    <TimelineRail
                      completed={isCompleted}
                      current={isCurrent}
                      last={isLast}
                    />

                    <AccordionItem
                      value={item.id}
                      disabled={!isEnabled}
                      className="border-none"
                    >
                      <AccordionTrigger
                        className={cn(
                          "min-h-12 py-0 hover:no-underline",
                          "[&>svg]:size-4 [&>svg]:shrink-0",
                          "[&>svg]:text-accent/70!",
                          isPending &&
                            "cursor-default text-muted-foreground/35 [&>svg]:hidden",
                        )}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={cn(
                              "text-sm",
                              isCompleted && "font-normal text-primary/70",
                              isCurrent && "font-medium",
                              isPending && "font-normal text-primary/25",
                            )}
                          >
                            {item.title}
                          </span>

                          {isCurrent && (
                            <Badge className="h-5 rounded-full px-2 text-[10px] font-normal">
                              Current
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="pb-4">
                        <div className="rounded-sm border-s-2 border-accent/70 bg-background px-4 py-3 text-xs leading-5 text-primary/70">
                          {item.description}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </div>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 rounded-sm border-secondary">
          <CardHeader className="pb-3">
            <CardTitle
              className={cn(
                "text-sm font-semibold flex items-center gap-1",
                fontClass,
              )}
            >
              <FileText className="text-primary/40 size-3.5" />
              {t("Fields.description.label")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-primary/65 leading-relaxed whitespace-pre-line">
              {caseDetails.description}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 rounded-sm border-secondary">
          <CardContent className="space-y-3">
            <InfoRow
              icon={Tag}
              label={t("Fields.category.descLabel")}
              value={caseDetails.specialization.name}
            />
            <InfoRow
              icon={MapPin}
              label={t("Fields.location.label")}
              value={caseDetails.city}
            />
            <InfoRow
              icon={CalendarDays}
              label={t("posted")}
              value={formatDate(caseDetails.created_at)}
            />
            <InfoRow
              icon={TriangleAlert}
              label={t("Fields.budget.label")}
              value={`${caseDetails.budget_min} - ${caseDetails.budget_max} ${tCommon("AED")}`}
            />
            <Separator className="bg-secondary" />
            <BackBtn>
              <span className="text-xs">{t("backToCases")}</span>
            </BackBtn>
          </CardContent>
        </Card>

        {/* <div className="md:col-span-3">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <p className={cn("font-semibold", fontClass)}>
                {t("lawyersOffers")}
              </p>
              <Badge className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-2 h-6">
                3 {t("offers")}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <LawyerOfferCard />
            <LawyerOfferCard />
          </div>
        </div> */}
      </div>
    </>
  );
}
