import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Offer } from "@/types/lawyer/my-offers";
import { getTranslations } from "next-intl/server";

export default async function ListOfOffers({
  listOfOffers,
}: {
  listOfOffers: Offer[];
}) {
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("Lawyer.MyOffers");

  return (
    <div className="space-y-4">
      {listOfOffers.map((offer) => (
        <Card
          key={offer.id}
          className="rounded-sm border border-secondary px-4 gap-0"
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

          <p className="font-semibold text-xs flex items-center gap-0.5">
            <span className="text-accent">{tCommon("AED")}</span>
            <span>{offer.amount}</span>
            <span className="text-primary/35">{t("Proposed")}</span>
          </p>

          <p className="font-semibold text-xs text-primary/35 mt-1">
            {t("SubmittedOn", { date: formatDate(offer.created_at) })}
          </p>
        </Card>
      ))}
    </div>
  );
}

function OfferStatusBadge({
  status,
  statusLabel,
}: {
  status: string;
  statusLabel: string;
}) {
  switch (status) {
    case "pending":
      return (
        <Badge className="rounded-xs h-6.5 bg-background text-primary/50 border border-primary/25">
          <span className="size-2 bg-primary/10 rounded-full" />
          {statusLabel}
        </Badge>
      );

    default:
      return null;
  }
}
