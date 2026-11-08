import type { Metadata } from "next";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";
import type { Counts, Emergency } from "@/types/lawyer/emergency-history";
import DataPreview from "@/components/client-lawyer/lawyer/emergency-history/data-preview";
import FiltersControl from "@/components/client-lawyer/lawyer/emergency-history/filters-control";
import Hint from "@/components/client-lawyer/reusable/hint";

type SearchParams = {
  result?: string;
  page?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.EmergencyHistory");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("Lawyer.EmergencyHistory");
  const { result, page } = await searchParams;

  const { data } = await http.get<{
    counts: Counts;
    data: Emergency[];
    meta: Meta;
  }>("/api/lawyer/emergency/requests", {
    params: {
      result: result && result !== "all" ? result : "",
      page: page || "1",
    },
  });

  console.log(data);

  return (
    <div className="container max-w-7xl py-10 space-y-6">
      <div>
        <Title>{t("Title")}</Title>
        <Hint>{t("Subtitle")}</Hint>
      </div>

      <div className="space-y-5">
        <FiltersControl counts={data.counts} />
        <DataPreview emergency={data.data} pagination={data.meta} />
      </div>
    </div>
  );
}
