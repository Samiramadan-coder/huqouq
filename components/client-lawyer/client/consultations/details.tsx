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
import { ArrowRight, Phone, Video } from "lucide-react";
import { Consultation } from "@/types/client/consultation";
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

export default function Details({
  consultation,
}: {
  consultation: Consultation;
}) {
  const t = useTranslations("Client.Consultations.Details");
  const { lawyer, payment, can } = consultation;

  const TypeIcon = consultation.type === "video" ? Video : Phone;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-sm border-secondary bg-transparent text-primary/50 font-normal text-xs hover:text-accent hover:bg-transparent"
        >
          {t("trigger")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md gap-0 p-0 rounded-sm ring-0!">
        <DialogHeader className="p-6 border-b border-secondary">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={lawyer.photo_url} alt={lawyer.name} />
              <AvatarFallback>{lawyer.name[0]}</AvatarFallback>
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

          <div className="grid grid-cols-2 gap-5">
            <DetailItem label={t("consultationType")}>
              <span className="flex items-center gap-2">
                <TypeIcon className="size-4 text-accent" aria-hidden="true" />
                {consultation.type_label}
              </span>
            </DetailItem>

            <DetailItem label={t("duration")}>
              {t("minutes", { count: consultation.duration_minutes })}
            </DetailItem>

            <div className="col-span-2">
              <DetailItem label={t("dateTime")}>
                {t("dateTimeValue", {
                  date: consultation.date_label,
                  time: consultation.time_label,
                })}
              </DetailItem>
            </div>

            <div className="col-span-2">
              <DetailItem label={t("pricePaid")}>
                {payment.amount === 0
                  ? t("free")
                  : `${payment.currency} ${payment.amount}`}
              </DetailItem>
            </div>
          </div>

          {consultation.brief && (
            <div className="bg-background border-s-2 border-accent px-4 py-3 space-y-1">
              <p className={labelClassName}>{t("whatYouShared")}</p>
              <p className="text-sm italic text-primary/60 leading-relaxed">
                &ldquo;{consultation.brief}&rdquo;
              </p>
            </div>
          )}

          {can.join_call && (
            <Button className="w-full h-12 rounded-sm bg-accent hover:bg-accent/80">
              {t("joinCall")}
              <ArrowRight
                className="size-4 rtl:rotate-180"
                aria-hidden="true"
              />
            </Button>
          )}

          {(can.reschedule || can.cancel) && (
            <div className="flex gap-4">
              {can.reschedule && (
                <Reschedule
                  lawyerId={consultation.lawyer.id}
                  consultationId={consultation.id}
                />
              )}
              {can.cancel && (
                <Cancel
                  consultationId={consultation.id}
                  policy={consultation.cancellation.policy || undefined}
                />
              )}
            </div>
          )}

          {can.cancel && consultation.cancellation.policy && (
            <p className="text-center text-xs text-primary/35">
              {consultation.cancellation.policy}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
