import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";
import { CircleCheck, Clock, MoveRight } from "lucide-react";
import type { Offer, OfferStatus } from "@/types/lawyer/my-offers";

export default async function ListOfOffers({
  listOfOffers,
}: {
  listOfOffers: Offer[];
}) {
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("Lawyer.MyOffers");

  return (
    <div className="space-y-4">
      {listOfOffers.length > 0 ? (
        listOfOffers.map((offer) => (
          <Card
            key={offer.id}
            className={cn("rounded-sm border border-secondary px-4 gap-0", {
              "border-amber-200": offer.display_status === "pending_fees",
              "border-emerald-200": offer.display_status === "in_progress",
            })}
            style={{ boxShadow: "none" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <Badge className="text-[10px] rounded-xs h-6 bg-accent/15 text-accent border border-accent/25">
                  {offer.case.specialization}
                </Badge>
              </div>
              <OfferStatusBadge
                status={offer.display_status}
                statusLabel={offer.display_status_label}
              />
            </div>

            <h3 className="font-semibold text-primary mb-1">
              {offer.case.title}
            </h3>

            <div className="flex items-center gap-3">
              <p className="font-semibold text-xs flex items-center gap-1">
                <span className="text-accent">{tCommon("AED")}</span>
                <span>{offer.amount}</span>
                <span className="text-primary/35">{t("Proposed")}</span>
              </p>

              {offer.expected_timeline && (
                <div className="flex items-center gap-1">
                  <Clock className="size-3 text-primary/35" />
                  <span className="text-primary/35 text-xs">
                    {offer.expected_timeline}
                  </span>
                </div>
              )}
            </div>

            <p className="font-semibold text-xs text-primary/35 mt-1">
              {t("SubmittedOn", { date: formatDate(offer.created_at) })}
            </p>

            {/* Pending Fee Hint */}
            {offer.display_status === "pending_fees" && (
              <div className="border-t border-amber-100 mt-3 pt-3 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  <Clock className="size-3 text-amber-700" />{" "}
                  <span className="text-amber-700 text-xs font-medium">
                    {t("PendingFeesHint")}
                  </span>
                </div>
                <Link
                  className="underline text-xs text-amber-700 flex items-center gap-1 whitespace-nowrap ms-auto"
                  href={`/lawyer/browse-cases/${offer.case.id}`}
                >
                  {t("ViewCase")}
                  <MoveRight className="size-3 rtl:rotate-180" />
                </Link>
              </div>
            )}

            {/* Accepted Hint  */}
            {offer.display_status === "in_progress" && (
              <div className="border-t border-emerald-100 mt-3 pt-3 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  <CircleCheck className="size-3 text-emerald-700" />{" "}
                  <span className="text-emerald-700 text-xs font-medium">
                    {t("AcceptedHint")}
                  </span>
                </div>
                <Link
                  className="underline text-xs text-emerald-700 flex items-center gap-1 whitespace-nowrap ms-auto"
                  href={`/lawyer/browse-cases/${offer.case.id}`}
                >
                  {t("ViewCase")}
                  <MoveRight className="size-3 rtl:rotate-180" />
                </Link>
              </div>
            )}
          </Card>
        ))
      ) : (
        <p className="text-xs text-primary/50">{t("NoOffers")}</p>
      )}
    </div>
  );
}

// OfferStatusBadge component to display the status of the offer with appropriate styling
function OfferStatusBadge({
  status,
  statusLabel,
}: {
  status: OfferStatus;
  statusLabel: string;
}) {
  switch (status) {
    case "pending_fees":
      return (
        <Badge className="rounded-xs h-6.5 bg-amber-50 text-amber-700 border-amber-200 border">
          <span className="size-1.5 bg-amber-700 rounded-full me-1" />
          {statusLabel}
        </Badge>
      );

    case "in_progress":
      return (
        <Badge className="rounded-xs h-6.5 bg-emerald-50 text-emerald-700 border-emerald-200 border">
          <span className="size-1.5 bg-emerald-700 rounded-full me-1" />
          {statusLabel}
        </Badge>
      );

    default:
      return (
        <Badge className="rounded-xs h-6.5 bg-background text-primary/50 border border-primary/15">
          <span className="size-1.5 bg-primary/10 rounded-full me-1" />
          {statusLabel}
        </Badge>
      );
  }
}
