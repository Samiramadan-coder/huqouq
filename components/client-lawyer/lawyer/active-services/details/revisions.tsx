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
      <h2 className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-5">
        {t("revisions")}
      </h2>

      <div className="space-y-3">
        {revisions.map((revision, index) => (
          <p
            key={revision.id}
            className="rounded-sm flex sm:items-center justify-between flex-col sm:flex-row gap-2 bg-amber-50 border border-amber-200 px-3 py-2.5"
          >
            <span className="min-w-0 text-amber-900 font-semibold text-sm flex gap-1">
              <span>{index + 1}.</span>{" "}
              <span className="min-w-0 wrap-break-word">{revision.note}</span>
            </span>
            <span className="ms-auto text-xs text-primary/50 whitespace-nowrap">
              {formatDate(revision.requested_at)}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}
