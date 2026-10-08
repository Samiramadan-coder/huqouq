import { cookies } from "next/headers";
import ApproveDelivery from "./approve-delivery";
import RequestRevision from "./request-revision";
import { getTranslations } from "next-intl/server";
import { CircleAlert } from "lucide-react";
import DeliveredFiles from "./delivered-files";
import { LegalServiceDetails } from "@/types/client/legal-services";

export default async function DeliveredSection({
  service,
}: {
  service: LegalServiceDetails;
}) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value || "";
  const t = await getTranslations("Client.LegalServices");
  const note =
    service.latest_delivery?.note ?? service.deliveries?.[0]?.note ?? null;

  return (
    <div className="bg-white border border-amber-200 rounded-sm overflow-hidden">
      <div className="bg-amber-50 border-b border-amber-200 px-5 py-4 flex items-start gap-3">
        <CircleAlert
          className="text-amber-600 size-5 shrink-0"
          aria-hidden="true"
        />
        <p className=" text-sm font-semibold text-amber-800">
          {t("lawyerDeliveredFlag", {
            lawyerName: service.hired_lawyer?.name || "",
            service: service.service_type_label,
          })}
        </p>
      </div>

      <DeliveredFiles service={service} token={token} />

      <div className="px-5 py-4 border-b border-[#EDE9E1]">
        <p className=" text-xs font-semibold tracking-widest uppercase text-primary/35 mb-2">
          {t("noteFromLawyer")}
        </p>
        <p className=" text-sm text-primary/60 leading-relaxed whitespace-pre-line wrap-break-word">
          {note || "-"}
        </p>
      </div>
      <div className="px-5 py-5 flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          {service.can.approve_delivery && (
            <ApproveDelivery serviceId={service.id} />
          )}
          {service.can.request_revision && (
            <RequestRevision serviceId={service.id} />
          )}
        </div>
        <button className="self-start  text-xs text-[#9B2C2C]/60 hover:text-[#9B2C2C] transition-colors duration-200 underline underline-offset-2">
          {t("openDispute")}
        </button>
      </div>
    </div>
  );
}
