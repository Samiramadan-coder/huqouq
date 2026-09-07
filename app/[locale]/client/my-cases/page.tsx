import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import { CaseDetails, Counts } from "@/types/client/cases";
import Title from "@/components/client-lawyer/reusable/title";
import AddNew from "@/components/client-lawyer/reusable/add-new";
import Filters from "@/components/client-lawyer/client/cases/filters";
import DataPreview from "@/components/client-lawyer/client/cases/data-preview";

type SearchParams = {
  tab?: string;
  page?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tab, page } = await searchParams;
  const t = await getTranslations("Client.Cases");

  const { data, ok } = await http.get<{
    data: CaseDetails[];
    counts: Counts;
    meta: Meta;
  }>("/api/cases", {
    params: {
      tab: tab || "",
      page: page || "1",
    },
  });

  console.log("Fetched cases data:", data); // Debugging line to check the fetched data

  if (!ok) {
    throw new Error("Failed to fetch cases");
  }

  return (
    <div className="space-y-6 container max-w-7xl">
      <Title>{t("myCases")}</Title>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <Filters counts={data.counts} />

        <div className="ms-auto shrink-0">
          <AddNew href="/client/cases/create">{t("addNew")}</AddNew>
        </div>
      </div>

      <DataPreview cases={data.data} pagination={data.meta} />
    </div>
  );
}
