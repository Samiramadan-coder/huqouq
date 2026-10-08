import { Suspense } from "react";
import type { Metadata } from "next";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { LoaderPinwheelIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";
import { Counts, Service } from "@/types/lawyer/active-services";
import FiltersControl from "@/components/client-lawyer/lawyer/active-services/filters-control";
import DataPreview from "@/components/client-lawyer/lawyer/active-services/data-preview";

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

async function ListOfActiveServices({
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

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("Lawyer.ActiveServices");

  return (
    <div className="container py-10 space-y-6">
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
        <ListOfActiveServices searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
