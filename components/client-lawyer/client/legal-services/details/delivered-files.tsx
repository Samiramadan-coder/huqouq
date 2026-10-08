import { FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LegalServiceDetails } from "@/types/client/legal-services";
import DownloadFile from "@/components/client-lawyer/reusable/download-file";

// Files the lawyer delivered, across every delivery of the request
export default async function DeliveredFiles({
  service,
  token,
}: {
  service: LegalServiceDetails;
  token: string;
}) {
  const t = await getTranslations("Client.LegalServices");
  const files = (service.deliveries ?? []).flatMap(
    (delivery) => delivery.files,
  );

  if (files.length === 0) return null;

  return (
    <div className="px-5 py-5 border-b border-secondary">
      <p className=" text-xs font-semibold tracking-widest uppercase text-primary/35 mb-3">
        {t("deliveredFiles")}
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
  );
}
