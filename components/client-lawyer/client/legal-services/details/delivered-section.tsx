import { cookies } from "next/headers";
import { CircleAlert } from "lucide-react";
import DeliveryHistory from "./delivery-history";
import ApproveDelivery from "./approve-delivery";
import RequestRevision from "./request-revision";
import ReviewCountdown from "./review-countdown";
import { getTranslations } from "next-intl/server";
import { LegalServiceDetails } from "@/types/client/legal-services";
import { getFormatters } from "@/lib/format.server";

export default async function DeliveredSection({
  service,
}: {
  service: LegalServiceDetails;
}) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value || "";
  const t = await getTranslations("Client.LegalServices");
  const format = await getFormatters();

  return (
    <div className="space-y-4">
      <div className="bg-white border border-amber-200 rounded-sm overflow-hidden">
        {service.review_deadline && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-4 flex items-start gap-3">
            <CircleAlert
              className="text-amber-600 size-5 shrink-0"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-2">
              <p className=" text-sm font-semibold text-amber-800">
                {t("lawyerDeliveredFlag", {
                  date: format.date(service.review_deadline),
                })}
              </p>
              <ReviewCountdown deadline={service.review_deadline} />
            </div>
          </div>
        )}

        <div className="px-5 py-5 flex flex-wrap items-center gap-3">
          {service.can.approve_delivery && (
            <ApproveDelivery serviceId={service.id} />
          )}
          {service.can.request_revision && (
            <RequestRevision serviceId={service.id} />
          )}
          <button className="text-xs text-[#9B2C2C]/60 hover:text-[#9B2C2C] transition-colors duration-200 underline underline-offset-2">
            {t("openDispute")}
          </button>
        </div>
      </div>

      <div className="bg-white border border-secondary rounded-sm">
        <DeliveryHistory
          token={token}
          deliveries={service.deliveries}
          awaitingReview
        />
      </div>
    </div>
  );
}
