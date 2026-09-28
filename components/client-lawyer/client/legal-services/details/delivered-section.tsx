import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { LegalServiceDetails } from "@/types/client/legal-services";
import { CircleAlert, CircleCheck, FileText, RotateCcw } from "lucide-react";
import DownloadFile from "@/components/client-lawyer/reusable/download-file";

export default async function DeliveredSection({
  service,
}: {
  service: LegalServiceDetails;
}) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value || "";
  const t = await getTranslations("Client.LegalServices");
  const allFiles = service.deliveries.flatMap((delivery) => delivery.files);

  return (
    <div className="bg-white border border-amber-200 rounded-sm overflow-hidden">
      <div className="bg-amber-50 border-b border-amber-200 px-5 py-4 flex items-start gap-3">
        <CircleAlert className="text-amber-600 size-5" />
        <p className="font-sans text-sm font-semibold text-amber-800">
          {t("lawyerDeliveredFlag", {
            lawyerName: service.hired_lawyer?.name || "",
          })}
        </p>
      </div>

      <div className="px-5 py-5 border-b border-secondary">
        <p className="font-sans text-xs font-semibold tracking-widest uppercase text-primary/35 mb-3">
          {t("deliveredFiles")}
        </p>

        <div className="space-y-2">
          {allFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 bg-background border border-secondary rounded-sm px-4 py-3"
            >
              <FileText
                className="text-accent size-4 shrink-0"
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm text-primary font-medium truncate">
                  {file.name}
                </p>
                <p className="font-sans text-xs text-primary/35">
                  {(file.size_bytes / 1024).toFixed(2)} KB
                </p>
              </div>
              <DownloadFile id={file.id} name={file.name} token={token} />
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 py-4 border-b border-[#EDE9E1]">
        <p className="font-sans text-xs font-semibold tracking-widest uppercase text-primary/35 mb-2">
          {t("noteFromLawyer")}
        </p>
        <p className="font-sans text-sm text-primary/60 leading-relaxed">
          {service.deliveries[0].note || "-"}
        </p>
      </div>
      <div className="px-5 py-5 flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="ghost"
            className="h-10.5 inline-flex items-center gap-2 bg-emerald-600 text-white font-sans text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-emerald-700 transition-colors duration-200"
          >
            <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
            {t("approve")}
          </Button>
          <Button
            variant="ghost"
            className="h-10.5 inline-flex items-center gap-2 border border-amber-400 text-amber-700 font-sans text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-amber-50 transition-colors duration-200"
          >
            <RotateCcw className="size-4 shrink-0" aria-hidden="true" />
            {t("requestRevision")}
          </Button>
        </div>
        <button className="self-start font-sans text-xs text-[#9B2C2C]/60 hover:text-[#9B2C2C] transition-colors duration-200 underline underline-offset-2">
          {t("openDispute")}
        </button>
      </div>
    </div>
  );
}
