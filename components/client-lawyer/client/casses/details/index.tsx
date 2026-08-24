import {
  CalendarDays,
  Eye,
  FileText,
  MapPin,
  Tag,
  TriangleAlert,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { cn } from "@/lib/utils";
import InfoRow from "./info-row";
import TimelineRail from "./timeline-radial";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LawyerOfferCard from "./lawyer-offer-card";
import { Separator } from "@/components/ui/separator";
import { getLocale, getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const timeline = [
  {
    id: "posted",
    title: "Posted",
    description: "Posted on 18 Jun 2025 · 47 views so far.",
  },
  {
    id: "approved",
    title: "Approved",
    description: "Your case was reviewed and approved.",
  },
  {
    id: "offers",
    title: "Offers Received",
    description:
      "3 offers received. Review and compare them to find the right lawyer.",
  },
  {
    id: "hired",
    title: "Hired",
    description: "You have hired a lawyer for this case.",
  },
  {
    id: "progress",
    title: "In Progress",
    description: "Your lawyer is currently working on the case.",
  },
  {
    id: "closure",
    title: "Pending Closure",
    description: "The case is waiting for final closure.",
  },
  {
    id: "closed",
    title: "Closed",
    description: "The case has been closed.",
  },
  {
    id: "reviewed",
    title: "Reviewed",
    description: "Your review for this case has been submitted.",
  },
];

export default async function Index() {
  const locale = await getLocale();
  const t = await getTranslations("Client.Cases");
  const fontClass = locale === "en" ? "font-lora" : "";
  const currentStep = 4;

  return (
    <>
      <BackBtn>
        <span>{t("backToCases")}</span>
      </BackBtn>

      <div>
        <div className="flex items-center justify-between gap-4">
          <Title>Case name goes here.</Title>
          <div className="space-x-2">
            <Button
              variant="outline"
              className="rounded-sm border-secondary font-normal text-xs text-primary/55"
            >
              {t("editCase")}
            </Button>
            <Button
              variant="outline"
              className="rounded-sm border-secondary font-normal text-xs text-destructive"
            >
              {t("closeCase")}
            </Button>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <Badge className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-2 h-6">
            {t("Filters.hasOffers")}
          </Badge>
          <Badge className="text-accent bg-accent/10 border border-accent/30 px-2.5 py-2 h-6 rounded-sm">
            {t("urgent")}
          </Badge>
          <div className="flex items-center gap-1">
            <Eye className="text-primary/35 size-3.5" />
            <span className="text-primary/35 text-xs">47 Views</span>
          </div>
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
              Case description goes here.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 rounded-sm border-secondary">
          <CardContent className="space-y-3">
            <InfoRow
              icon={Tag}
              label={t("Fields.category.descLabel")}
              value="category name goes here"
            />
            <InfoRow
              icon={MapPin}
              label={t("Fields.location.label")}
              value="location name goes here"
            />
            <InfoRow
              icon={CalendarDays}
              label={t("posted")}
              value="posted date goes here"
            />
            <InfoRow
              icon={TriangleAlert}
              label={t("Fields.budget.label")}
              value="budget goes here"
            />
            <Separator className="bg-secondary" />
            <BackBtn>
              <span className="text-xs">{t("backToCases")}</span>
            </BackBtn>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
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
        </div>
      </div>
    </>
  );
}
