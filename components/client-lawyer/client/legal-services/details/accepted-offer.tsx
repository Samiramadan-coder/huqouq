import { Clock } from "lucide-react";
import DeadlineChip from "@/components/client-lawyer/reusable/deadline-chip";
import HiredLawyerRow from "./hired-lawyer-row";
import { getTranslations } from "next-intl/server";
import { LegalServiceDetails } from "@/types/client/legal-services";

// The lawyer is working on the first delivery
export default async function OfferAccepted({
  service,
}: {
  service: LegalServiceDetails;
}) {
  const t = await getTranslations("Client.LegalServices");
  const { accepted_offer, hired_lawyer, deadline } = service;

  if (!accepted_offer || !hired_lawyer) return null;

  return (
    <div className="bg-white border border-secondary rounded-sm overflow-hidden">
      <div className="bg-[#EDF2F7] border-b border-[#bee3f8] px-5 py-4 flex items-start gap-3">
        <Clock className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold text-primary mb-0.5">
              {t("inProgress")}
            </p>
            <p className="text-xs text-primary/55 leading-relaxed">
              {t("inProgressMessage", {
                name: hired_lawyer.name,
                service: service.service_type_label,
              })}
            </p>
          </div>
          {deadline && (
            <DeadlineChip
              viewer="client"
              deadline={deadline}
              className="text-amber-700"
            />
          )}
        </div>
      </div>

      <HiredLawyerRow
        offer={accepted_offer}
        hiredLawyer={hired_lawyer}
        canOpenChat={service.can.open_chat}
      />
    </div>
  );
}
