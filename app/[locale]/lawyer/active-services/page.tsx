import { Suspense } from "react";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { LoaderPinwheelIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
// import { Offer } from "@/types/lawyer/service-offers";
import Title from "@/components/client-lawyer/reusable/title";
// import FiltersControl from "@/components/client-lawyer/lawyer/service-offers/filters-control";
import { Counts, Service } from "@/types/lawyer/active-services";
import FiltersControl from "@/components/client-lawyer/lawyer/active-services/filters-control";
import DataPreview from "@/components/client-lawyer/lawyer/active-services/data-preview";
// import DataPreview from "@/components/client-lawyer/lawyer/service-offers/data-preview";

type SearchParams = {
  page?: string;
  status?: string;
};

async function ListOfServiceOffers({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, status } = await searchParams;

  const { data, ok } = await http.get<{
    counts: Counts;
    data: Service[];
    meta: Meta;
  }>(`/api/lawyer/legal-services/active`, {
    params: {
      page: page || 1,
      status: status || "",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch service offers");
  }

  console.log(data);

  return (
    <div className="space-y-6">
      <FiltersControl counts={data.counts} />
      <DataPreview services={data.data} pagination={data.meta} />
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("Lawyer.ActiveServices");

  return (
    <div className="container max-w-7xl py-10 space-y-6">
      <Title>{t("title")}</Title>

      <Suspense
        fallback={
          <div className="p-4 sm:p-6">
            <LoaderPinwheelIcon className="animate-spin text-accent" />
          </div>
        }
      >
        <ListOfServiceOffers searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
