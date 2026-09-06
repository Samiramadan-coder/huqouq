import { http } from "@/lib/http";
import { getTranslations } from "next-intl/server";
import type { Counts, Offer } from "@/types/lawyer/my-offers";
import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";
import Stats from "@/components/client-lawyer/lawyer/my-offers/Stats";
import FiltersControl from "@/components/client-lawyer/lawyer/my-offers/filters-control";
import ListOfOffers from "@/types/lawyer/list-of-offers";

type SearchParams = {
  status?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status } = await searchParams;
  const t = await getTranslations("Lawyer.MyOffers");

  // Fetch offers data from the API
  const { data, ok } = await http.get<{
    counts: Counts;
    data: Offer[];
  }>("/api/lawyer/offers", {
    params: {
      status: status ?? "",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch offers");
  }

  console.log(data);

  return (
    <div className="space-y-6 container max-w-3xl">
      <div className="space-y-2">
        <Title>{t("Title")}</Title>
        <Hint>{t("Description")}</Hint>
      </div>

      <Stats counts={data.counts} />

      <FiltersControl counts={data.counts} />

      <ListOfOffers listOfOffers={data.data} />
    </div>
  );
}
