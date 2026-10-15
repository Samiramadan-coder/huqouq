"use client";

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Consultation } from "@/types/lawyer/consultations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const labelClassName = "text-[11px] uppercase tracking-widest text-primary/40";

function DetailBox({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background border border-secondary rounded-sm p-3 space-y-1">
      <p className={labelClassName}>{label}</p>
      <p className="text-sm text-primary">{children}</p>
    </div>
  );
}

export default function ConsultationDetails({
  consultation,
}: {
  consultation: Consultation;
}) {
  const t = useTranslations("Lawyer.Consultations.Bookings");
  const locale = useLocale();
  const { client, payment } = consultation;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-xs font-normal text-primary/50 hover:bg-transparent hover:text-accent"
        >
          {t("ViewDetails")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md gap-0 p-0 rounded-sm ring-0!">
        <DialogHeader className="px-6 py-5 border-b border-secondary">
          <DialogTitle
            className={cn(
              "text-base font-semibold text-primary",
              locale === "en" && "font-lora",
            )}
          >
            {t("Details.Title")}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={client.photo_url} alt={client.display_name} />
              <AvatarFallback>{client.display_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-primary">
                {client.display_name}
              </p>
              <p className="text-xs text-primary/40">{t("Details.Client")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DetailBox label={t("Details.Type")}>
              {consultation.type_label}
            </DetailBox>
            <DetailBox label={t("Details.Date")}>
              {t("Details.DateTimeValue", {
                date: consultation.date_label,
                time: consultation.time_label,
              })}
            </DetailBox>
            <DetailBox label={t("Details.Duration")}>
              {t("Details.DurationValue", {
                count: consultation.duration_minutes,
              })}
            </DetailBox>
            <DetailBox label={t("Details.Price")}>
              {payment.currency} {payment.amount}
            </DetailBox>
          </div>

          {consultation.brief && (
            <div className="space-y-1">
              <p className={labelClassName}>{t("Details.ClientNote")}</p>
              <p className="text-sm text-primary/60 leading-relaxed">
                {consultation.brief}
              </p>
            </div>
          )}

          <DialogClose asChild>
            <Button className="w-full h-11 rounded-sm">
              {t("Details.Close")}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
