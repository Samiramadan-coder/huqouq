import { Meta } from "@/types/shared";
import StatusBadge from "./status-badge";
import { useTranslations } from "next-intl";
import RateConsultation from "./rate-consultation";
import ReportConsultation from "./report-consultation";
import JoinCall from "../../reusable/call/join-call";
import { Calendar, Clock, Phone } from "lucide-react";
import Details, { NeedsNewTimeNotice } from "./details";
import { toCallType } from "../../reusable/call/config";
import { Consultation } from "@/types/client/consultation";
import PaginationTemplate from "../../reusable/pagination-template";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DataPreview({
  data,
  pagination,
  openId,
}: {
  data: Consultation[];
  pagination: Meta;
  // Consultation whose details open on load, e.g. right after booking
  openId?: number;
}) {
  const t = useTranslations("Client.Consultations");

  return (
    <div className="mt-4 space-y-4">
      {data.length > 0 ? (
        data.map((consultation) => (
          <div
            key={consultation.id}
            className="bg-white rounded-sm border transition-all duration-200 overflow-hidden border-secondary hover:border-accent/25"
          >
            <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar className="size-11">
                <AvatarImage
                  src={consultation.lawyer.photo_url ?? undefined}
                  alt={consultation.lawyer.name}
                />
                <AvatarFallback>{consultation.lawyer.name?.[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="ltr:font-lora text-sm font-semibold text-primary">
                  {consultation.lawyer.name}
                </p>
                <p className="text-xs uppercase tracking-widest mb-2 text-accent">
                  {consultation.lawyer.specializations.join(", ")}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-primary/45">
                    <Calendar className="size-3" aria-hidden="true" />
                    {consultation.date_label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-primary/45">
                    <Clock className="size-3" aria-hidden="true" />
                    {consultation.time_label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-primary/45">
                    <Phone className="size-3" aria-hidden="true" />
                    {consultation.type_label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:ms-auto">
                <StatusBadge
                  status={consultation.status}
                  label={consultation.status_label}
                />
                <Details
                  consultation={consultation}
                  defaultOpen={consultation.id === openId}
                />
                {consultation.can.rate && !consultation.review && (
                  <RateConsultation consultation={consultation} />
                )}
                {consultation.can.report && (
                  <ReportConsultation consultation={consultation} />
                )}
                {consultation.can.join_call && (
                  <JoinCall
                    consultationId={consultation.id}
                    callType={toCallType(consultation.type)}
                    schedule={{
                      startsAt: consultation.starts_at,
                      durationMinutes: consultation.duration_minutes,
                      joinOpensAt: consultation.join_call_opens_at,
                    }}
                    remoteName={consultation.lawyer.name}
                    remotePhoto={consultation.lawyer.photo_url}
                    label={t("joinCall")}
                    consultationsHref="/client/my-consultations"
                    whoIsOnCall="client"
                    lawyerId={consultation.lawyer.id}
                  />
                )}
              </div>
            </div>

            {consultation.status === "needs_new_time" && (
              <div className="px-5 pb-5">
                <NeedsNewTimeNotice consultation={consultation} />
              </div>
            )}
          </div>
        ))
      ) : (
        <span className="text-primary/55">{t("noConsultations")}</span>
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
