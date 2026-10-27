import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Step } from "@/types/client/my-cases";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";
import { getFormatters } from "@/lib/format.server";
import TimelineRail from "../../client/cases/details/timeline-radial";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Same steps as the client timeline, described from the lawyer's side
export default async function CaseTimeline({ timeline }: { timeline: Step[] }) {
  const t = await getTranslations("Lawyer.BrowseCases.Timeline");
  const format = await getFormatters();

  const visibleSteps = timeline.filter((step) => step.state !== "skipped");

  function getStepDescription(step: Step) {
    switch (step.key) {
      case "posted":
        return step.at ? t("PostedOn", { date: format.date(step.at) }) : "";

      case "approved":
        return step.at
          ? t("PublishedOn", { date: format.date(step.at) })
          : t("PublishedPending");

      case "offers":
        return t("OffersReceived", {
          count: format.number(step.meta.offers_count),
        });

      case "hired":
        return t("HiredMessage");

      case "in_progress":
        return step.at ? t("InProgressMessage") : t("PendingFeesMessage");

      case "pending_closure":
        return t("PendingClosureMessage");

      case "closed":
        return step.at
          ? t("ClosedOn", { date: format.date(step.at) })
          : t("Closed");

      case "reviewed":
        return step.at
          ? t("ReviewedOn", { date: format.date(step.at) })
          : t("ReviewPending");

      default:
        return "";
    }
  }

  return (
    <Card className="rounded-xs ring-0! border border-secondary">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold ltr:font-lora">
          {t("Title")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Accordion
          type="multiple"
          defaultValue={[
            timeline.find((step) => step.state === "current")?.key || "",
          ]}
          className="w-full"
        >
          {visibleSteps.map((item, index) => {
            // Closed is the final step, so it is done rather than current
            const isClosedStep =
              item.key === "closed" && item.state === "current";
            const isCompleted = item.state === "done" || isClosedStep;
            const isCurrent = item.state === "current" && !isClosedStep;
            const isPending = item.state === "upcoming";
            const isLast = index === visibleSteps.length - 1;

            return (
              <div
                key={item.key}
                className="grid grid-cols-[20px_minmax(0,1fr)] gap-x-3"
              >
                <TimelineRail
                  completed={isCompleted}
                  current={isCurrent}
                  last={isLast}
                />

                <AccordionItem
                  value={item.key}
                  disabled={isPending}
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
                        {item.label}
                      </span>

                      {isCurrent && (
                        <Badge className="h-5 rounded-full px-2 text-[10px] font-normal">
                          {t("Current")}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pb-4">
                    <div className="rounded-sm border-s-2 border-accent/70 bg-background px-4 py-3 text-xs leading-5 text-primary/70">
                      {getStepDescription(item)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </div>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
