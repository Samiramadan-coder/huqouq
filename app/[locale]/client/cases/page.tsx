import { getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";
import AddNew from "@/components/client-lawyer/reusable/add-new";
import Filters from "@/components/client-lawyer/client/casses/filters";
import DataPreview from "@/components/client-lawyer/client/casses/data-preview";

export default async function Page() {
  const t = await getTranslations("Client.Cases");

  return (
    <div className="space-y-6 container max-w-7xl">
      <Title>{t("myCases")}</Title>

      <div className="flex items-center justify-between">
        <Filters />
        <AddNew href="/client/cases/create">{t("addNew")}</AddNew>
      </div>

      <DataPreview />
    </div>
  );
}
