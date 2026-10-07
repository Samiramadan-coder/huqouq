import { http } from "@/lib/http";
import type { Metadata } from "next";
import { Meta } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import type { Counts, Offer } from "@/types/lawyer/my-offers";
import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";
import Stats from "@/components/client-lawyer/lawyer/my-offers/Stats";
import FiltersControl from "@/components/client-lawyer/lawyer/my-offers/filters-control";
import ListOfOffers from "@/components/client-lawyer/lawyer/my-offers/list-of-offers";
import { Suspense } from "react";
import { LoaderPinwheelIcon } from "lucide-react";

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

async function GetMOffers({
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

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("Lawyer.MyOffers");

  return (
    <div className="space-y-6 container max-w-7xl py-10">
      <div className="space-y-2">
        <Title>{t("Title")}</Title>
        <Hint>{t("Description")}</Hint>
      </div>

      <Suspense
        fallback={
          <div role="status" aria-label="Loading">
            <LoaderPinwheelIcon
              className="animate-spin text-accent"
              aria-hidden="true"
            />
          </div>
        }
      >
        <GetMOffers searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
