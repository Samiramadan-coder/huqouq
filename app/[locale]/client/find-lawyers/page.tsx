import { http } from "@/lib/http";
import type { Metadata } from "next";
import { Meta } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import { Filters, Lawyer } from "@/types/client/find-lawyer";
import { FindLawyerFiltersProvider } from "@/providers/find-lawyer-filters";
import ListOfLawyers from "@/components/client-lawyer/client/find-lawyer/list-of-lawyers";
import FiltersControl from "@/components/client-lawyer/client/find-lawyer/filters-control";
import QuerySearchAndTitle from "@/components/client-lawyer/client/find-lawyer/query-search-and-title";

type SerachParams = {
  page?: string;
  caseId?: string;
  specialization_id?: string;
  emirate?: string;
  language?: string;
  min_rating?: string;
  availability?: string;
  sort?: string;
  q?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Client.FindLawyer");

  return {
    title: `${t("findLawyer")} | Huqouq`,
    description: t("findLawyerDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SerachParams>;
}) {
  const {
    page,
    caseId,
    specialization_id,
    emirate,
    language,
    min_rating,
    availability,
    sort,
    q,
  } = await searchParams;

  const { data } = await http.get<{
    data: Lawyer[];
    filters: Filters;
    meta: Meta;
  }>("/api/lawyers", {
    params: {
      page: page || "1",
      specialization_id: specialization_id ?? "",
      emirate: emirate ?? "",
      language: language ?? "",
      min_rating: min_rating ?? "",
      sort: sort ?? "",
      q: q ?? "",
      availability: availability ?? "",
    },
  });

  return (
    <FindLawyerFiltersProvider>
      <div className="space-y-6 px-4 sm:px-6 py-10">
        <QuerySearchAndTitle />

        <div className="flex items-start gap-5">
          <div className="w-60 shrink-0 sticky top-20 hidden lg:block">
            <FiltersControl filters={data.filters} />
          </div>

          <div className="flex-1 min-w-0">
            <ListOfLawyers
              lawyers={data.data}
              pagination={data.meta}
              caseId={caseId}
              filters={data.filters}
            />
          </div>
        </div>
      </div>
    </FindLawyerFiltersProvider>
  );
}
