import type { Metadata } from "next";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import { Counts, Service } from "@/types/lawyer/active-services";
import DataPreview from "@/components/client-lawyer/lawyer/active-services/data-preview";
import FiltersControl from "@/components/client-lawyer/lawyer/active-services/filters-control";

type SearchParams = {
  page?: string;
  status?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.ActiveServices");

  return {
    title: `${t("title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, status } = await searchParams;

  const { data } = await http.get<{
    counts: Counts;
    data: Service[];
    meta: Meta;
  }>(`/api/lawyer/legal-services/active`, {
    params: {
      page: page || 1,
      status: status || "",
    },
  });

  return (
    <div className="space-y-6">
      <FiltersControl counts={data.counts} />
      <DataPreview services={data.data} pagination={data.meta} />
    </div>
  );
}
