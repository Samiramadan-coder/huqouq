import { FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Delivery } from "@/types/lawyer/active-services";
import DownloadFile from "@/components/client-lawyer/reusable/download-file";
import { getTranslations } from "next-intl/server";

export default async function Deliveries({
  deliveries,
  token,
}: {
  deliveries: Delivery[];
  token: string;
}) {
  const t = await getTranslations("Lawyer.ActiveServices.Details");
  // Oldest first, so each delivery's position is its round number
  const rounds = [...deliveries].sort(
    (a, b) =>
      new Date(a.delivered_at).getTime() - new Date(b.delivered_at).getTime(),
  );

  return (
    <div className="bg-white border border-secondary rounded-sm p-5 flex flex-col gap-5">
      <h2 className="text-[10px] font-semibold tracking-widest uppercase text-primary/35">
        {t("deliveries")}
      </h2>

      {rounds.map((delivery, index) => (
        <div key={delivery.id} className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-primary">
              {t("round", { number: index + 1 })}
            </h3>
            <span className="text-xs text-primary/50">
              {formatDate(delivery.delivered_at)}
            </span>
          </div>

          {delivery.note && (
            <p className="text-sm text-primary/70 whitespace-pre-line wrap-break-word">
              {delivery.note}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(delivery.files ?? []).map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 border border-secondary rounded-sm px-4 py-3"
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
      ))}
    </div>
  );
}
