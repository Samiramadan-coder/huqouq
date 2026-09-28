import { formatDate } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Revision } from "@/types/lawyer/active-services";

export default async function Revisions({
  revisions,
}: {
  revisions: Revision[];
}) {
  const t = await getTranslations("Lawyer.ActiveServices.Details");
  return (
    <div className="bg-white border border-amber-400 rounded-sm p-5">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-5">
        {t("revisions")}
      </p>

      <div className="space-y-3">
        {revisions.map((revision) => (
          <p
            key={revision.id}
            className="flex sm:items-center justify-between flex-col sm:flex-row gap-2 border border-secondary p-2"
          >
            <span className="text-primary/90 text-sm">{revision.note}</span>
            <span className="ms-auto text-xs text-primary/50 whitespace-nowrap">
              {formatDate(revision.requested_at)}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}
