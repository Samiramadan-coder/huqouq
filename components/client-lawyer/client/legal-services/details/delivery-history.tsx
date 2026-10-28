import { cn } from "@/lib/utils";
import DeliveredFiles from "./delivered-files";
import { getTranslations } from "next-intl/server";
import { LegalServiceDetails } from "@/types/client/legal-services";

// Every delivery of the request as its own round, oldest first, so files from different rounds never mix
export default async function DeliveryHistory({
  token,
  deliveries,
  awaitingReview = false,
}: {
  token: string;
  deliveries: LegalServiceDetails["deliveries"];
  // The latest round is still waiting for the client's response
  awaitingReview?: boolean;
}) {
  const t = await getTranslations("Client.LegalServices");
  const rounds = [...deliveries].sort(
    (a, b) =>
      new Date(a.delivered_at).getTime() - new Date(b.delivered_at).getTime(),
  );

  if (rounds.length === 0) return null;

  return (
    <div className="px-5 py-5">
      <h2 className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-4">
        {t("deliveryHistory")}
      </h2>

      <ol>
        {rounds.map((delivery, index) => {
          const isLast = index === rounds.length - 1;
          const isCurrent = isLast && awaitingReview;

          return (
            <li
              key={delivery.id}
              className="grid grid-cols-[20px_minmax(0,1fr)] gap-x-4"
            >
              <div className="flex flex-col items-center pt-4">
                <span
                  className={cn(
                    "size-4 shrink-0 rounded-full border-2 flex items-center justify-center",
                    isCurrent ? "border-amber-500" : "border-primary/20",
                  )}
                  aria-hidden="true"
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      isCurrent ? "bg-amber-500" : "bg-primary/20",
                    )}
                  />
                </span>
                <span className="w-px flex-1 bg-secondary" />
              </div>

              <div className={cn(!isLast && "pb-4")}>
                <DeliveredFiles
                  token={token}
                  files={delivery.files || []}
                  roundNumber={index + 1}
                  note={delivery.note}
                  deliveredAt={delivery.delivered_at}
                  awaitingReview={isCurrent}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
