import { Meta } from "@/types/shared";
import { useTranslations } from "next-intl";
import { Calendar, Phone, Video } from "lucide-react";
import ConsultationStatus from "./consultation-status";
import CancelConsultation from "./cancel-consultation";
import ConsultationDetails from "./consultation-details";
import { Consultation } from "@/types/lawyer/consultations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PaginationTemplate from "@/components/client-lawyer/reusable/pagination-template";
import JoinCall from "@/components/client-lawyer/reusable/call/join-call";
import { toCallType } from "@/components/client-lawyer/reusable/call/config";

export default function DataPreview({
  data,
  pagination,
}: {
  data: Consultation[];
  pagination: Meta;
}) {
  const t = useTranslations("Lawyer.Consultations.Bookings");

  return (
    <div className="mt-4 space-y-3">
      {data.length > 0 ? (
        data.map((consultation) => {
          const { client, payment } = consultation;
          const TypeIcon = consultation.type === "video" ? Video : Phone;

          return (
            <div
              key={consultation.id}
              className="bg-white rounded-sm border border-secondary px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex flex-1 min-w-0 items-center gap-4">
                <Avatar className="size-10 shrink-0">
                  <AvatarImage
                    src={client.photo_url}
                    alt={client.display_name}
                  />
                  <AvatarFallback>{client.display_name[0]}</AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary">
                    {client.display_name}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-primary/45">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" aria-hidden="true" />
                      {t("Details.DateTimeValue", {
                        date: consultation.date_label,
                        time: consultation.time_label,
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <TypeIcon className="size-3" aria-hidden="true" />
                      {consultation.type_label}
                    </span>
                    <span className="font-semibold text-accent">
                      {payment.currency} {payment.amount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:ms-auto">
                <ConsultationDetails consultation={consultation} />

                {consultation.can.cancel && (
                  <CancelConsultation consultationId={consultation.id} />
                )}

                <ConsultationStatus consultation={consultation} />

                {consultation.can.join_call && (
                  <JoinCall
                    consultationId={consultation.id}
                    callType={toCallType(consultation.type)}
                    remoteName={client.display_name}
                    remotePhoto={client.photo_url}
                    label={t("joinCall")}
                  />
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-primary/55">{t("NoConsultations")}</p>
      )}

      {pagination.last_page > 1 && (
        <PaginationTemplate
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
        />
      )}
    </div>
  );
}
