import { FileText } from "lucide-react";
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
  const files = deliveries.flatMap((delivery) => delivery.files ?? []);

  return (
    <div className="bg-white border border-secondary rounded-sm p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      <h2 className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 sm:col-span-2 md:col-span-3">
        {t("deliveries")}
      </h2>

      {files.map((file) => (
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
  );
}
