import { http } from "@/lib/http";
import { getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";
import AddNew from "@/components/client-lawyer/reusable/add-new";
import Filters from "@/components/client-lawyer/client/casses/filters";
import DataPreview from "@/components/client-lawyer/client/casses/data-preview";
import { CaseDetails, Counts } from "@/types/client/cases";
import { Meta } from "@/types/shared";

type SearchParams = {
  status?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status } = await searchParams;
  const t = await getTranslations("Client.Cases");

  const { data, ok } = await http.get<{
    data: CaseDetails[];
    counts: Counts;
    meta: Meta;
  }>("/api/cases", {
    params: {
      status: status || "",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch cases");
  }

  console.log(data.data);

  return (
    <div className="space-y-6 container max-w-7xl">
      <Title>{t("myCases")}</Title>

      <div className="flex items-center justify-between">
        <Filters counts={data.counts} />
        <AddNew href="/client/cases/create">{t("addNew")}</AddNew>
      </div>

      <DataPreview cases={data.data} />
    </div>
  );
}
