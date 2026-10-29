import { RotateCcw } from "lucide-react";
import DeadlineChip from "@/components/client-lawyer/reusable/deadline-chip";
import HiredLawyerRow from "./hired-lawyer-row";
import { getTranslations } from "next-intl/server";
import { getFormatters } from "@/lib/format.server";
import { Delivery, LegalServiceDetails } from "@/types/client/legal-services";

// The client requested a revision and the lawyer is preparing the next round
export default async function RevisionInProgress({
  service,
}: {
  service: LegalServiceDetails;
}) {
  const t = await getTranslations("Client.LegalServices");
  const format = await getFormatters();
  const { accepted_offer, hired_lawyer, deadline } = service;

  if (!accepted_offer || !hired_lawyer) return null;

  // The pending revision is the one requested on the latest delivery
  const latestDelivery = service.deliveries.reduce<Delivery | null>(
    (latest, delivery) =>
      !latest || new Date(delivery.delivered_at) > new Date(latest.delivered_at)
        ? delivery
        : latest,
    null,
  );

  const pendingRevision = latestDelivery
    ? (service.revisions ?? []).find(
        (revision) => revision.delivery_id === latestDelivery.id,
      )
    : undefined;

  return (
    <div className="bg-white border border-amber-200 rounded-sm overflow-hidden">
      <div className="bg-amber-50 border-b border-amber-200 px-5 py-4 flex items-start gap-3">
        <RotateCcw
          className="size-5 text-amber-600 shrink-0"
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <p className="text-sm font-semibold text-amber-800 leading-relaxed wrap-break-word">
            {pendingRevision
              ? t.rich("revisionRequestedOn", {
                  date: format.date(pendingRevision.requested_at),
                  note: pendingRevision.note,
                  name: hired_lawyer.name,
                  // Isolates the client's note so its own direction doesn't break the sentence
                  isolate: (chunks) => <bdi>{chunks}</bdi>,
                })
              : t("waitingForRevision", { name: hired_lawyer.name })}
          </p>
          {deadline && <DeadlineChip viewer="client" deadline={deadline} />}
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
