import { Suspense } from "react";
import type { Metadata } from "next";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { LoaderPinwheelIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Counts, Offer } from "@/types/lawyer/service-offers";
import Title from "@/components/client-lawyer/reusable/title";
import FiltersControl from "@/components/client-lawyer/lawyer/service-offers/filters-control";
import DataPreview from "@/components/client-lawyer/lawyer/service-offers/data-preview";

type SearchParams = {
  page?: string;
  status?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.ServiceOffers");

  return {
    title: `${t("title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

async function ListOfServiceOffers({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, status } = await searchParams;
  const t = await getTranslations("Lawyer.ServiceOffers");

  const { data } = await http.get<{
    counts: Counts;
    data: Offer[];
    meta: Meta;
  }>(`/api/lawyer/legal-service-offers`, {
    params: {
      page: page || 1,
      status: status || "",
    },
  });

  return (
    <div className="space-y-6">
      <p className="text-sm text-primary/45 mt-0.5">
        <span>
          {data.counts.all} {t("totalOffers")}
        </span>
        <span> · </span>
        <span>
          {data.counts.pending} {t("pending")}
        </span>
        <span> · </span>
        <span>
          {data.counts.accepted} {t("accepted")}
        </span>
        <span> · </span>
        <span>
          {data.counts.rejected} {t("rejected")}
        </span>
      </p>
      <FiltersControl counts={data.counts} />
      <DataPreview offers={data.data} pagination={data.meta} />
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("Lawyer.ServiceOffers");
  return (
    <div className="container py-10">
      <Title>{t("title")}</Title>

      <Suspense
        fallback={
          <div className="p-4 sm:p-6" role="status" aria-label="Loading">
            <LoaderPinwheelIcon
              className="animate-spin text-accent"
              aria-hidden="true"
            />
          </div>
        }
      >
        <ListOfServiceOffers searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
