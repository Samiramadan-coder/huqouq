import RateService from "./rate-service";
import { CircleCheck, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LegalServiceDetails } from "@/types/client/legal-services";

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
        {service.review ? (
          <div>
            <p className="text-sm font-semibold mb-1">{t("yourReview")}</p>
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <span className="font-semibold text-primary/70">
                {t("rating")}
              </span>
              : {service.review.rating}
              <Star className="size-4 fill-accent text-accent" />
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-primary/70">
                {t("comment")}
              </span>
              : {service.review.comment}
            </p>
          </div>
        ) : (
          <RateService serviceId={service.id} />
        )}
      </div>
    </div>
  );
}
