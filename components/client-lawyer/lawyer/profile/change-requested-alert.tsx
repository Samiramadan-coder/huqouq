import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function ChangesRequestedAlert({ count }: { count: number }) {
  const t = await getTranslations("Lawyer.Profile");

  return (
    <div className="flex items-center justify-between flex-wrap gap-6 rounded-md border border-amber-300/50 bg-white px-5 py-6 mb-7">
      <div className="flex items-center gap-5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50">
          <AlertTriangle className="size-5 text-amber-500" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-primary">
            {t("changesRequest")}
          </h3>

          <p className="max-w-xl text-sm leading-6 text-primary/50">
            {count} {t("changeRequestAlert")}
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        className="ms-auto shrink-0 bg-white font-normal border-amber-400 text-amber-700 hover:bg-amber-50 hover:text-amber-800 h-9.5"
      >
        {t("viewFeedback")}
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
