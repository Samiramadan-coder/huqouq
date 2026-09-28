import TimelineRail from "./timeline-radial";
import CompareOffers from "./compare-offers";
import OfferAccepted from "./accepted-offer";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import LawyerOfferCard from "./lawyer-offer-card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Clock, MessageSquare } from "lucide-react";
import { LegalServiceStatus } from "../list-of-services";
import { getLocale, getTranslations } from "next-intl/server";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import { LegalServiceDetails } from "@/types/client/legal-services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DeliveredSection from "./delivered-section";
import Completed from "./completed";

export default async function Index({
  legalService,
}: {
  legalService: LegalServiceDetails;
}) {
  const locale = await getLocale();
  const t = await getTranslations("Client.LegalServices");
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <div className="grid items-start grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div className="md:col-span-2 space-y-4">
        {/* Accepted offer and hired lawyer section */}
        {legalService.accepted_offer &&
          legalService.hired_lawyer &&
          legalService.display_status === "in_progress" && (
            <div>
              <OfferAccepted
                offer={legalService.accepted_offer}
                hiredLawyer={legalService.hired_lawyer}
              />
            </div>
          )}

        {/* Lawyers offers section */}
        {legalService.accepted_offer === null && (
          <div className="space-y-6 mt-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <p className={cn("font-semibold", fontClass)}>
                  {t("lawyersOffers")}
                </p>
                <Badge className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-2 h-6">
                  {legalService.offers_count} {t("offers")}
                </Badge>
              </div>

              {legalService.offers_count ? (
                <CompareOffers
                  serviceId={legalService.id}
                  offers={legalService.offers}
                />
              ) : null}
            </div>

            <div className="flex flex-col gap-4">
              {legalService.offers_count > 0 ? (
                <>
                  {legalService.offers.map((offer) => (
                    <LawyerOfferCard
                      key={offer.id}
                      serviceId={legalService.id}
                      serviceOffer={offer}
                    />
                  ))}
                </>
              ) : (
                <p className="text-sm text-primary/65">{t("noOffers")}</p>
              )}
            </div>
          </div>
        )}

        {legalService.display_status === "delivered" && (
          <DeliveredSection service={legalService} />
        )}

        {legalService.display_status === "completed" && (
          <Completed service={legalService} />
        )}

        {/* Legal status timeline section */}
        <Card className="w-full rounded-xs ring-0! border border-secondary">
          <CardHeader className="pb-3">
            <CardTitle className={cn("text-sm font-semibold", fontClass)}>
              {t("legalStatusTimeLine")}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="w-full space-y-4">
              {legalService.timeline
                .filter((item) => item.state !== "skipped")
                .map((item, index) => {
                  const isCompleted = item.state === "done";
                  const isCurrent = item.state === "current";
                  const isPending = item.state === "upcoming";
                  const isLast = index === legalService.timeline.length - 1;

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

                      <span
                        className={cn(
                          isCompleted && "text-primary/55 line-through",
                          isCurrent && "text-primary",
                          isPending && "text-primary/25",
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1 space-y-4">
        <Card className="rounded-xs ring-0! border border-secondary">
          <CardContent className="space-y-3">
            <LegalServiceStatus
              status={legalService.display_status}
              statusLabel={legalService.display_status_label}
            />

            <div>
              <p className=" text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-1">
                {t("Fields.type.label")}
              </p>
              <p
                className={cn(
                  `text-base font-semibold text-primary`,
                  fontClass,
                )}
              >
                {legalService.service_type_label}
              </p>
            </div>

            <div>
              <p className=" text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-1">
                {t("Fields.description.label")}
              </p>
              <p className="text-sm text-primary/55 leading-relaxed mb-4 line-clamp-4">
                {legalService.description}
              </p>
            </div>

            <Separator className="bg-secondary" />

            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-xs text-primary/45">
                <Calendar className="size-4" />
                {t("Submitted")} {formatDate(legalService.created_at)}
              </span>

              <span className="flex items-center gap-2 text-xs text-primary/45">
                <MapPin className="size-4" />
                {legalService.emirate}
              </span>

              <span className="flex items-center gap-2 text-xs text-primary/45">
                <Clock className="size-4" />
                {legalService.urgency_label}
              </span>
            </div>
          </CardContent>
        </Card>

        <Button className="bg-accent text-primary rounded-sm hover:bg-accent/80 w-full h-10">
          <MessageSquare />
          {t("openChat")}
        </Button>

        <BackBtn className="w-full h-10 border-secondary">
          <span>{t("backToLegal")}</span>
        </BackBtn>
      </div>
    </div>
  );
}
