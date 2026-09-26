import { formatDate } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import UrgencyBadge from "../../reusable/urgency-label";
import { Clock, FileText, MapPin, Paperclip } from "lucide-react";
import { LegalServiceDetails } from "@/types/lawyer/legal-services";

export default async function Details({
  service,
}: {
  service: LegalServiceDetails;
}) {
  const t = await getTranslations("Lawyer.LegalServices");

  return (
    <div className="flex gap-6 items-start">
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <div className="bg-white border border-[#EDE9E1] rounded-sm p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="min-w-11 h-11 rounded-sm bg-background border border-secondary flex items-center justify-center shrink-0">
              <FileText className="size-5 text-primary/50" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-accent tracking-wide">
                  {service.service_type_label}
                </span>
                <UrgencyBadge
                  urgency={service.urgency}
                  urgency_label={service.urgency_label}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1 text-xs text-primary/45">
                  <MapPin className="size-3 text-primary/40" />
                  {service.emirate}
                </span>
                <span className="flex items-center gap-1 text-xs text-primary/45">
                  <Clock className="size-3 text-primary/40" />
                  {formatDate(service.submitted_at)}
                </span>
                <span className="text-xs text-primary/45">
                  {service.offers_count} {t("offersSubmitted")}
                </span>
              </div>
            </div>
          </div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-2">
            {t("Details.requestDetails")}
          </p>
          <p className="font-sans text-sm text-primary leading-relaxed">
            {service.description}
          </p>
        </div>

        <div className="bg-white border border-secondary rounded-sm p-5">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-3">
            {t("Details.client")}
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-primary">
                {service.client.first_name.slice(0, 1)}
              </span>
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-primary">
                {service.client.first_name} ({t("Details.firstNameOnly")})
              </p>
              <p className="font-sans text-xs text-primary/40">
                {service.emirate} · {t("Details.contactDetailsHidden")}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-secondary rounded-sm p-5">
          <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-3">
            {t("Details.clientDocuments")}
          </p>

          {service.attachments.map((attach) => (
            <div className="flex flex-col gap-2" key={attach.id}>
              <div className="flex items-center justify-between gap-3 bg-background border border-secondary rounded-sm px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <Paperclip className="size-3 text-primary/40 shrink-0" />
                  <span className="font-sans text-sm text-primary">
                    {attach.name}
                  </span>
                  <span className="font-sans text-xs text-primary/35">
                    {(attach.size_bytes / 1024).toFixed(2)} KB
                  </span>
                </div>
                <button className="font-sans text-xs font-semibold text-accent hover:text-accent/80 transition-colors">
                  {t("Details.download")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
