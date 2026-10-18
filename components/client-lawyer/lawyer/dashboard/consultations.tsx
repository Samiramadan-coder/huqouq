import {
  Clock,
  Calendar,
  CalendarX,
  ArrowRight,
  CalendarCheck,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Consultation } from "@/types/lawyer/consultations";
import ConsultationDetails from "../consultations/consultation-details";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Consultations({
  consultations,
}: {
  consultations: Consultation[];
}) {
  const t = useTranslations("Lawyer.Dashboard");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-semibold text-primary ltr:font-lora">
          {t("Consultations")}
        </h3>
        <Link
          href="/lawyer/consultations/availability-settings"
          className="text-sm text-accent flex items-center gap-1 ms-auto"
        >
          {t("ManageAvailability")}
          <ArrowRight className="rtl:rotate-180 size-4" />
        </Link>
      </div>

      {consultations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {consultations.map((consultation) => (
            <div
              key={consultation.id}
              className="rounded-sm border border-secondary p-5 flex items-start gap-4 bg-white"
            >
              <Avatar className="size-11">
                <AvatarImage
                  src={consultation.client.photo_url}
                  alt={consultation.client.display_name}
                />
                <AvatarFallback>
                  {consultation.client.display_name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-widest font-medium text-accent">
                  {t("StatusConsultation", {
                    status: consultation.status_label,
                  })}
                </p>
                <p className="ltr:font-lora text-base font-semibold text-primary truncate">
                  {consultation.client.display_name}
                </p>
                <p className="text-sm text-primary/45 truncate mb-2">
                  {consultation.brief || consultation.type_label}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 text-sm text-primary/45">
                    <Calendar className="size-3.5" aria-hidden="true" />
                    {consultation.date_label}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-primary/45">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {consultation.time_label}
                  </span>
                </div>
              </div>

              <ConsultationDetails consultation={consultation} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-dashed border-secondary bg-white px-6 py-10 flex flex-col items-center text-center gap-3">
          <div className="size-12 rounded-full bg-accent/10 flex items-center justify-center">
            <CalendarX className="size-5 text-accent" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <p className="ltr:font-lora font-semibold text-primary">
              {t("NoConsultations")}
            </p>
            <p className="text-sm text-primary/55 max-w-sm">
              {t("NoConsultationsDescription")}
            </p>
          </div>
          <Link
            href="/lawyer/consultations/availability-settings"
            className="text-sm text-accent flex items-center gap-1"
          >
            {t("ManageAvailability")}
            <ArrowRight className="rtl:rotate-180 size-4" />
          </Link>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between bg-white border border-secondary rounded-sm px-5 py-3.5">
        <div className="flex items-center gap-3">
          <CalendarCheck className="size-5 text-accent" />
          <p className="font-sans text-sm text-primary/55">
            {t("KeepAvailabilityUpdated")}
          </p>
        </div>
        <Link
          className="shrink-0 font-sans text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1 group ml-4"
          href="/lawyer/consultations/availability-settings"
        >
          {t("ManageAvailability")}{" "}
          <ArrowRight className="rtl:rotate-180 size-4" />
        </Link>
      </div>
    </div>
  );
}
