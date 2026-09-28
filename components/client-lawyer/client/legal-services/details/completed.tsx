import { LegalServiceDetails } from "@/types/client/legal-services";
import { CircleCheck, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Completed({
  service,
}: {
  service: LegalServiceDetails;
}) {
  const t = await getTranslations("Client.LegalServices");

  return (
    <div className="bg-white border border-emerald-200 rounded-sm overflow-hidden">
      <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-4 flex items-start gap-3">
        <CircleCheck className="size-5 text-emerald-600" />
        <div>
          <p className=" text-sm font-semibold text-emerald-800 mb-0.5">
            {t("serviceCompleted")}
          </p>
          <p className=" text-xs text-emerald-700/75">
            {t("paymentReleased", {
              amount:
                service.payment?.currency +
                " " +
                service.payment?.lawyer_amount,
              lawyerName: service.hired_lawyer?.name || "",
            })}
          </p>
        </div>
      </div>
      <div className="px-5 py-4">
        <button className="inline-flex items-center gap-2 border border-accent/40 text-accent  text-sm font-semibold px-4 py-2 rounded-sm hover:bg-accent/8 transition-colors duration-200">
          <Star className="size-5" />
          {t("rateThisService")}
        </button>
      </div>
    </div>
  );
}
