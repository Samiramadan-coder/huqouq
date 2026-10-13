import { http } from "@/lib/http";
import type { Metadata } from "next";
import { Meta } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import type { Counts, Offer } from "@/types/lawyer/my-offers";
import Stats from "@/components/client-lawyer/lawyer/my-offers/Stats";
import FiltersControl from "@/components/client-lawyer/lawyer/my-offers/filters-control";
import ListOfOffers from "@/components/client-lawyer/lawyer/my-offers/list-of-offers";

type SearchParams = {
  status?: string;
  page?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.MyOffers");

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
  const { status, page } = await searchParams;

  // Fetch offers data from the API
  const { data } = await http.get<{
    counts: Counts;
    data: Offer[];
    meta: Meta;
  }>("/api/lawyer/offers", {
    params: {
      status: status ?? "",
      page: page || "1",
    },
  });

  return (
    <div className="space-y-4">
      <Stats counts={data.counts} />
      <FiltersControl counts={data.counts} />
      <ListOfOffers listOfOffers={data.data} pagination={data.meta} />
    </div>
  );
}
