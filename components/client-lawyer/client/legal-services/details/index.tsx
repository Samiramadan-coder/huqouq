import Completed from "./completed";
import TimelineRail from "./timeline-radial";
import CompareOffers from "./compare-offers";
import OfferAccepted from "./accepted-offer";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LawyerOfferCard from "./lawyer-offer-card";
import DeliveredSection from "./delivered-section";
import { Separator } from "@/components/ui/separator";
import { LegalServiceStatus } from "../list-of-services";
import { getLocale, getTranslations } from "next-intl/server";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import { LegalServiceDetails } from "@/types/client/legal-services";
import { MapPin, Calendar, Clock, FileText, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatRoom from "./chat-room";
import { cookies } from "next/headers";
import { Link } from "@/i18n/navigation";
import DownloadFile from "@/components/client-lawyer/reusable/download-file";

export default async function Index({
  legalService,
}: {
  legalService: LegalServiceDetails;
}) {
  const locale = await getLocale();
  const t = await getTranslations("Client.LegalServices");
  const fontClass = locale === "en" ? "font-lora" : "";
  const token = (await cookies()).get("token")?.value || "";
  const visibleSteps = legalService.timeline.filter(
    (item) => item.state !== "skipped",
  );
  const attachments = legalService.attachments ?? [];

  return (
    <div className="grid items-start grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div className="md:col-span-2 min-w-0 space-y-4">
        {/* Accepted offer and hired lawyer section */}
        {legalService.accepted_offer &&
          legalService.hired_lawyer &&
          legalService.display_status === "in_progress" && (
            <div>
              <OfferAccepted
                offer={legalService.accepted_offer}
                hiredLawyer={legalService.hired_lawyer}
                serviceLabel={legalService.service_type_label}
                canOpenChat={legalService.can.open_chat}
              />
            </div>
          )}

        {/* Lawyers offers section */}
        {legalService.accepted_offer === null && (
          <div className="space-y-6 mt-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
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
                  serviceLabel={legalService.service_type_label}
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

        {/* Delivered section */}
        {legalService.display_status === "delivered" && (
          <DeliveredSection service={legalService} />
        )}

        {/* Completed section */}
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
              {visibleSteps.map((item, index) => {
                const isCompleted = item.state === "done";
                const isCurrent = item.state === "current";
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

        {legalService.can.open_chat && (
          <div id="service-chat" className="scroll-mt-20">
            <ChatRoom
              serviceId={`service-${legalService.id}`}
              lawyerName={legalService.hired_lawyer?.name || ""}
            />
          </div>
        )}
      </div>

      <div className="md:col-span-1 space-y-4">
        <Card className="rounded-xs ring-0! border border-secondary">
          <CardContent className="space-y-3">
            <LegalServiceStatus
              status={legalService.display_status}
              statusLabel={legalService.display_status_label}
            />

            {legalService.rejection_reason && (
              <p className="text-xs leading-relaxed text-red-700 wrap-break-word">
                {t("rejectionReason", {
                  reason: legalService.rejection_reason,
                })}
              </p>
            )}

            <div>
              <p className=" text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-1">
                {t("Fields.type.label")}
              </p>
              <h1
                className={cn(
                  `text-base font-semibold text-primary`,
                  fontClass,
                )}
              >
                {legalService.service_type_label}
              </h1>
            </div>

            <div>
              <p className=" text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-1">
                {t("Fields.description.label")}
              </p>
              <p className="text-sm text-primary/55 leading-relaxed mb-4 whitespace-pre-line wrap-break-word">
                {legalService.description}
              </p>
            </div>

            {attachments.length > 0 && (
              <div>
                <p className=" text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-2">
                  {t("attachments")}
                </p>
                <ul className="space-y-2">
                  {attachments.map((file) => (
                    <li key={file.id} className="flex items-center gap-2">
                      <FileText
                        className="size-3.5 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1 truncate text-xs text-primary/70">
                        {file.name}
                      </span>
                      <DownloadFile
                        id={file.id}
                        name={file.name}
                        token={token}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator className="bg-secondary" />

            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-xs text-primary/45">
                <Calendar className="size-4" aria-hidden="true" />
                {t("Submitted")} {formatDate(legalService.created_at)}
              </span>

              <span className="flex items-center gap-2 text-xs text-primary/45">
                <MapPin className="size-4" aria-hidden="true" />
                {legalService.emirate}
              </span>

              <span className="flex items-center gap-2 text-xs text-primary/45">
                <Clock className="size-4" aria-hidden="true" />
                {legalService.urgency_label}
              </span>
            </div>
          </CardContent>
        </Card>

        {legalService.can.edit && (
          <Button
            asChild
            variant="outline"
            className="w-full h-10 rounded-sm border-secondary font-normal text-primary/70"
          >
            <Link href={`/client/legal-services/edit/${legalService.id}`}>
              {t("edit")}
            </Link>
          </Button>
        )}

        {legalService.can.open_chat && (
          <Button
            asChild
            className="bg-accent text-primary rounded-sm hover:bg-accent/80 w-full h-10"
          >
            <a href="#service-chat">
              <MessageSquare aria-hidden="true" />
              {t("openChat")}
            </a>
          </Button>
        )}

        <BackBtn className="w-full h-10 border-secondary">
          <span>{t("backToLegal")}</span>
        </BackBtn>
      </div>
    </div>
  );
}
