import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import DeliveryRound from "./delivery-round";
import { getTranslations } from "next-intl/server";
import { getFormatters } from "@/lib/format.server";

// Who is looking: the wording of the client's response differs
export type DeliveryHistoryViewer = "client" | "lawyer";

// The fields both the client and the lawyer APIs return for a delivery
export type Round = {
  id: number;
  delivered_at: string;
  note: string | null;
  files: { id: number; name: string; size_bytes: number }[];
};

export type RoundRevision = {
  delivery_id: number;
  note: string;
  requested_at: string;
};

// Every delivery of the request as its own round, oldest first, so files from different rounds never mix
export default async function DeliveryHistory({
  viewer,
  token,
  deliveries,
  revisions,
  awaitingReview = false,
  inPreparation = false,
}: {
  viewer: DeliveryHistoryViewer;
  token: string;
  deliveries: Round[];
  revisions: RoundRevision[];
  // The latest round is still waiting for the client's response
  awaitingReview?: boolean;
  // The lawyer is preparing the next round after a revision
  inPreparation?: boolean;
}) {
  const t = await getTranslations("Common.DeliveryHistory");
  const format = await getFormatters();
  const rounds = [...deliveries].sort(
    (a, b) =>
      new Date(a.delivered_at).getTime() - new Date(b.delivered_at).getTime(),
  );

  if (rounds.length === 0) return null;

  return (
    <div className="px-5 py-5">
      <h2 className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-4">
        {t("title")}
      </h2>

      <ol>
        {rounds.map((delivery, index) => {
          const isLast = index === rounds.length - 1;
          const isCurrent = isLast && awaitingReview;
          const revision = revisions.find(
            (item) => item.delivery_id === delivery.id,
          );

          return (
            <li
              key={delivery.id}
              className="grid grid-cols-[20px_minmax(0,1fr)] gap-x-4"
            >
              <div className="flex flex-col items-center pt-4">
                <span
                  className={cn(
                    "size-4 shrink-0 rounded-full border-2 flex items-center justify-center",
                    revision || isCurrent
                      ? "border-amber-500 text-amber-500"
                      : "border-primary/20",
                  )}
                  aria-hidden="true"
                >
                  {revision ? (
                    <RotateCcw className="size-2.5" strokeWidth={3} />
                  ) : (
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        isCurrent ? "bg-amber-500" : "bg-primary/20",
                      )}
                    />
                  )}
                </span>
                <span className="w-px flex-1 bg-secondary" />
              </div>

              <div className={cn((!isLast || inPreparation) && "pb-4")}>
                <DeliveryRound
                  viewer={viewer}
                  token={token}
                  delivery={delivery}
                  roundNumber={index + 1}
                  awaitingReview={isCurrent}
                  revision={revision}
                />
              </div>
            </li>
          );
        })}

        {inPreparation && (
          <li className="grid grid-cols-[20px_minmax(0,1fr)] gap-x-4">
            <div className="flex flex-col items-center pt-4">
              <span
                className="size-4 shrink-0 rounded-full border-2 border-dashed border-primary/25"
                aria-hidden="true"
              />
              <span className="w-px flex-1 bg-secondary" />
            </div>

            <div className="border border-dashed border-primary/20 rounded-sm px-4 py-3">
              <h3 className="text-base font-semibold text-primary/45 ltr:font-lora">
                {t("roundInPreparation", {
                  number: format.number(rounds.length + 1),
                })}
              </h3>
              <p className="text-xs text-primary/35 mt-1">
                {t(
                  viewer === "client"
                    ? "roundInPreparationHint"
                    : "roundInPreparationHintLawyer",
                )}
              </p>
            </div>
          </li>
        )}
      </ol>
    </div>
  );
}
