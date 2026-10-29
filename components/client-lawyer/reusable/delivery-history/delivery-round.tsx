import {
  DeliveryHistoryViewer,
  Round,
  RoundRevision,
} from "./delivery-history";
import { getTranslations } from "next-intl/server";
import { getFormatters } from "@/lib/format.server";
import { CircleAlert, FileText, RotateCcw } from "lucide-react";
import DownloadFile from "@/components/client-lawyer/reusable/download-file";

// One delivery round: its files, the lawyer's note and the client's response
export default async function DeliveryRound({
  viewer,
  roundNumber,
  token,
  delivery,
  awaitingReview = false,
  revision,
}: {
  viewer: DeliveryHistoryViewer;
  roundNumber: number;
  token: string;
  delivery: Round;
  awaitingReview?: boolean;
  // The revision the client requested on this round, if any
  revision?: RoundRevision;
}) {
  const t = await getTranslations("Common.DeliveryHistory");
  const format = await getFormatters();
  const files = delivery.files ?? [];
  const responseLabel = t(
    viewer === "client" ? "yourResponse" : "clientResponse",
  );

  return (
    <div className="border border-secondary rounded-sm overflow-hidden">
      <div className="bg-background border-b border-secondary px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-primary ltr:font-lora">
          {t("round", { number: format.number(roundNumber) })}
        </h3>
        <span className="text-xs text-primary/45">
          {t("deliveredOn", { date: format.date(delivery.delivered_at) })}
        </span>
      </div>

      <div className="px-4 py-4 space-y-4">
        {files.length > 0 && (
          <div>
            <p className=" text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-2">
              {t("files")}
            </p>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 bg-background border border-secondary rounded-sm px-4 py-3"
                >
                  <FileText
                    className="text-accent size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <p className=" text-sm text-primary font-medium truncate">
                      {file.name}
                    </p>
                    <p className=" text-xs text-primary/35">
                      {(file.size_bytes / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <DownloadFile id={file.id} name={file.name} token={token} />
                </div>
              ))}
            </div>
          </div>
        )}

        {delivery.note && (
          <div>
            <p className=" text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-2">
              {t("lawyerNote")}
            </p>
            <p
              dir="auto"
              className=" text-sm text-primary/60 leading-relaxed whitespace-pre-line wrap-break-word border-s-2 border-secondary ps-3"
            >
              {delivery.note}
            </p>
          </div>
        )}

        {revision && (
          <div className="bg-amber-50 border border-amber-200 rounded-sm px-4 py-3">
            <p className=" text-[10px] font-semibold tracking-widest uppercase text-amber-700/60 mb-1">
              {responseLabel}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-800">
                <RotateCcw className="size-4 shrink-0" aria-hidden="true" />
                {t("revisionRequested")}
              </p>
              <span className="text-xs text-primary/45">
                {format.date(revision.requested_at)}
              </span>
            </div>
            <p
              dir="auto"
              className=" text-sm text-amber-900/80 leading-relaxed whitespace-pre-line wrap-break-word border-s-2 border-amber-400 ps-3"
            >
              {revision.note}
            </p>
          </div>
        )}

        {awaitingReview && !revision && (
          <div className="bg-amber-50 border border-amber-200 rounded-sm px-4 py-3">
            <p className=" text-[10px] font-semibold tracking-widest uppercase text-amber-700/60 mb-1">
              {responseLabel}
            </p>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-800">
              <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
              {t("awaitingReview")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
