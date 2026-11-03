"use client";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import Cancel from "./cancel";
import Reschedule from "./rescheduale";
import { useTranslations } from "next-intl";
import StatusBadge from "./status-badge";
import { Button } from "@/components/ui/button";
import { Phone, Video } from "lucide-react";
import JoinCall from "../../reusable/call/join-call";
import { toCallType } from "../../reusable/call/config";
import { Consultation } from "@/types/client/consultation";
import RateConsultation, { ConsultationReviewView } from "./rate-consultation";
import { useFormatters } from "@/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const labelClassName = "text-[11px] uppercase tracking-widest text-primary/40";

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className={labelClassName}>{label}</p>
      <div className="text-sm text-primary">{children}</div>
    </div>
  );
}

// Shown while the lawyer has cancelled and the client has to act
export function NeedsNewTimeNotice({
  consultation,
}: {
  consultation: Consultation;
}) {
  const t = useTranslations("Client.Consultations.Details");

  if (consultation.status !== "needs_new_time") return null;

  return (
    <div className="rounded-sm bg-amber-50 border border-amber-200 px-4 py-3 space-y-1">
      {consultation.lawyer_cancel_reason && (
        <p className="text-sm text-amber-900 wrap-break-word">
          <span className="font-semibold">{t("lawyerReason")}:</span>{" "}
          {consultation.lawyer_cancel_reason}
        </p>
      )}
      <p className="text-xs text-amber-800">{t("pickNewTimeOrCancel")}</p>
    </div>
  );
}

export default function Details({
  consultation,
  defaultOpen = false,
}: {
  consultation: Consultation;
  defaultOpen?: boolean;
}) {
  const t = useTranslations("Client.Consultations.Details");
  const format = useFormatters();
  const { lawyer, payment, can } = consultation;

  const TypeIcon = consultation.type === "video" ? Video : Phone;
  // The one allowed reschedule has been used and the API no longer offers it
  const rescheduleUsed =
    consultation.rescheduled &&
    !can.reschedule &&
    (consultation.status === "upcoming" ||
      consultation.status === "needs_new_time");

  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-sm border-secondary bg-transparent text-primary/50 font-normal text-xs hover:text-accent hover:bg-transparent"
        >
          {t("trigger")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md gap-0 p-0 rounded-sm ring-0! max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 border-b border-secondary">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage
                src={lawyer.photo_url ?? undefined}
                alt={lawyer.name}
              />
              <AvatarFallback>{lawyer.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="text-start">
              <DialogTitle className="ltr:font-lora text-sm font-semibold text-primary">
                {lawyer.name}
              </DialogTitle>
              <DialogDescription className="text-xs uppercase tracking-widest font-semibold text-accent">
                {lawyer.specializations.join(", ")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5">
          <StatusBadge
            status={consultation.status}
            label={consultation.status_label}
          />

          <NeedsNewTimeNotice consultation={consultation} />

          <div className="grid grid-cols-2 gap-5">
            <DetailItem label={t("consultationType")}>
              <span className="flex items-center gap-2">
                <TypeIcon className="size-4 text-accent" aria-hidden="true" />
                {consultation.type_label}
              </span>
            </DetailItem>

            <DetailItem label={t("duration")}>
              {t("minutes", {
                count: format.number(consultation.duration_minutes),
              })}
            </DetailItem>

            <div className="col-span-2">
              <DetailItem label={t("dateTime")}>
                {t("dateTimeValue", {
                  date: consultation.date_label,
                  time: consultation.time_label,
                })}
              </DetailItem>
            </div>

            <DetailItem label={t("pricePaid")}>
              {payment.amount === 0
                ? t("free")
                : format.money(payment.amount, payment.currency)}
            </DetailItem>

            {consultation.reference && (
              <DetailItem label={t("bookingReference")}>
                <span dir="ltr">{consultation.reference}</span>
              </DetailItem>
            )}
          </div>

          {consultation.brief && (
            <div className="bg-background border-s-2 border-accent px-4 py-3 space-y-1">
              <p className={labelClassName}>{t("whatYouShared")}</p>
              <p className="text-sm italic text-primary/60 leading-relaxed">
                &ldquo;{consultation.brief}&rdquo;
              </p>
            </div>
          )}

          {consultation.review ? (
            <ConsultationReviewView review={consultation.review} />
          ) : (
            can.rate && (
              <RateConsultation
                consultation={consultation}
                triggerClassName="w-full h-11"
              />
            )
          )}

          {can.join_call && (
            <JoinCall
              consultationId={consultation.id}
              callType={toCallType(consultation.type)}
              schedule={{
                startsAt: consultation.starts_at,
                durationMinutes: consultation.duration_minutes,
                joinOpensAt: consultation.join_call_opens_at,
              }}
              remoteName={lawyer.name}
              remotePhoto={lawyer.photo_url ?? undefined}
              label={t("joinCall")}
              consultationsHref="/client/my-consultations"
              whoIsOnCall="client"
              lawyerId={lawyer.id}
            />
          )}

          {(can.reschedule || can.cancel) && (
            <div className="flex gap-4">
              {can.reschedule && (
                <Reschedule
                  lawyerId={lawyer.id}
                  consultationId={consultation.id}
                />
              )}
              {can.cancel && (
                <Cancel
                  consultationId={consultation.id}
                  cancellation={consultation.cancellation}
                  currency={payment.currency}
                />
              )}
            </div>
          )}

          {rescheduleUsed && (
            <p className="text-center text-xs text-primary/45">
              {t("rescheduleUsed")}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
