import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import RateService from "./rate-service";
import DeliveryHistory from "@/components/client-lawyer/reusable/delivery-history/delivery-history";
import { CircleCheck, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getFormatters } from "@/lib/format.server";
import { LegalServiceDetails } from "@/types/client/legal-services";

export default async function Completed({
  service,
}: {
  service: LegalServiceDetails;
}) {
  const t = await getTranslations("Client.LegalServices");
  const format = await getFormatters();
  const token = (await cookies()).get("token")?.value || "";

  // The client only ever sees what they paid, never the lawyer's net or the platform fee
  const completedAt = service.timeline.find((e) => e.key === "completed")?.at;
  const amount = service.payment
    ? format.money(service.payment.amount, service.payment.currency)
    : "";

  // Who closed the service: the client approved it, an admin closed it, or it was approved automatically
  const isAutoApproved = !service.completed_by;
  const completedMessageKey =
    service.completed_by === "client"
      ? "completedOn"
      : service.completed_by === "admin"
        ? "completedByAdminOn"
        : "autoApprovedOn";

  return (
    <div className="space-y-4">
      <div className="bg-white border border-emerald-200 rounded-sm overflow-hidden">
        <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-4 flex items-start gap-3">
          <CircleCheck
            className="size-5 shrink-0 text-emerald-600"
            aria-hidden="true"
          />
          <div>
            <p className=" text-sm font-semibold text-emerald-800 mb-0.5">
              {t(isAutoApproved ? "autoApproved" : "serviceCompleted")}
            </p>
            {service.payment && (
              <p className=" text-xs text-emerald-700/75 leading-relaxed">
                {completedAt
                  ? t(completedMessageKey, {
                      date: format.date(completedAt),
                      amount,
                    })
                  : t("youPaid", { amount })}
              </p>
            )}
          </div>
        </div>

        <div className="px-5 py-4">
          {service.review ? (
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-2">
                {t("yourReview")}
              </p>
              <div
                className="flex items-center gap-2 mb-3"
                aria-label={t("ratingOutOf", {
                  rating: format.number(service.review.rating),
                })}
              >
                <div className="flex items-center gap-0.5" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "size-4",
                        star <= service.review!.rating
                          ? "fill-accent text-accent"
                          : "fill-secondary text-secondary",
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-primary">
                  {t("ratingOutOf", {
                    rating: format.number(service.review.rating),
                  })}
                </span>
              </div>
              {service.review.comment && (
                <blockquote className="border-s-2 border-accent ps-4">
                  <p className="text-sm text-primary/70 leading-relaxed whitespace-pre-line wrap-break-word ltr:font-lora">
                    {t("quotedComment", { comment: service.review.comment })}
                  </p>
                </blockquote>
              )}
            </div>
          ) : service.can.rate ? (
            <RateService serviceId={service.id} />
          ) : null}
        </div>
      </div>

      <div className="bg-white border border-secondary rounded-sm">
        <DeliveryHistory
          viewer="client"
          token={token}
          deliveries={service.deliveries}
          revisions={service.revisions ?? []}
        />
      </div>
    </div>
  );
}
