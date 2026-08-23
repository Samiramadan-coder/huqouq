import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import AddNew from "@/components/client-lawyer/reusable/add-new";
import Filters from "@/components/client-lawyer/client/casses/filters";
import DataPreview from "@/components/client-lawyer/client/casses/data-preview";

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations("Client.Cases");
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <div className="space-y-6 container max-w-7xl">
      <h1 className={cn("text-2xl font-semibold", fontClass)}>
        {t("myCases")}
      </h1>

      <div className="flex items-center justify-between">
        <Filters />
        <AddNew href="/client/cases/create">{t("addNew")}</AddNew>
      </div>

      <DataPreview />
    </div>
  );
}
