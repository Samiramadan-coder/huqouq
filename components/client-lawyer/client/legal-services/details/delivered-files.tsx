import { CircleAlert, FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LegalServiceDetails } from "@/types/client/legal-services";
import DownloadFile from "@/components/client-lawyer/reusable/download-file";
import { getFormatters } from "@/lib/format.server";

// One delivery round: its files, the lawyer's note and the client's response
export default async function DeliveredFiles({
  roundNumber,
  token,
  files,
  note,
  deliveredAt,
  awaitingReview = false,
}: {
  roundNumber: number;
  token: string;
  files: LegalServiceDetails["deliveries"][number]["files"];
  note: string | null;
  deliveredAt: string;
  awaitingReview?: boolean;
}) {
  const t = await getTranslations("Client.LegalServices");
  const format = await getFormatters();

  return (
    <div className="border border-secondary rounded-sm overflow-hidden">
      <div className="bg-background border-b border-secondary px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-primary ltr:font-lora">
          {t("round", { number: format.number(roundNumber) })}
        </h3>
        <span className="text-xs text-primary/45">
          {t("deliveredOn", { date: format.date(deliveredAt) })}
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
                    <p className=" text-xs text-primary/35" dir="ltr">
                      {(file.size_bytes / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <DownloadFile id={file.id} name={file.name} token={token} />
                </div>
              ))}
            </div>
          </div>
        )}

        {note && (
          <div>
            <p className=" text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-2">
              {t("noteFromLawyer")}
            </p>
            <p className=" text-sm text-primary/60 leading-relaxed whitespace-pre-line wrap-break-word border-s-2 border-secondary ps-3">
              {note}
            </p>
          </div>
        )}

        {awaitingReview && (
          <div className="bg-amber-50 border border-amber-200 rounded-sm px-4 py-3">
            <p className=" text-[10px] font-semibold tracking-widest uppercase text-amber-700/60 mb-1">
              {t("yourResponse")}
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
