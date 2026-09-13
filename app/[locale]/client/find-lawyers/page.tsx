import { Suspense } from "react";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { LoaderPinwheelIcon } from "lucide-react";
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
  rating?: string;
  availability?: string;
  sort?: string;
  q?: string;
};

async function GetListOfLawyers({
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
    rating,
    availability,
    sort,
    q,
  } = await searchParams;

  const { data, ok } = await http.get<{
    data: Lawyer[];
    filters: Filters;
    meta: Meta;
  }>("/api/lawyers", {
    params: {
      page: page || "1",
      specialization_id: specialization_id ?? "",
      emirate: emirate ?? "",
      language: language ?? "",
      rating: rating ?? "",
      sort: sort ?? "",
      q: q ?? "",
      availability: availability ?? "",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch lawyers");
  }

  return (
    <div className="flex items-start gap-5">
      <div className="w-60 shrink-0 sticky top-20 hidden lg:block">
        <FiltersControl filters={data.filters} />
      </div>

      <div className="flex-1">
        <ListOfLawyers
          lawyers={data.data}
          pagination={data.meta}
          caseId={caseId}
          filters={data.filters}
        />
      </div>
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SerachParams>;
}) {
  return (
    <FindLawyerFiltersProvider>
      <div className="space-y-6">
        <QuerySearchAndTitle />

        <Suspense
          fallback={<LoaderPinwheelIcon className="animate-spin text-accent" />}
        >
          <GetListOfLawyers searchParams={searchParams} />
        </Suspense>
      </div>
    </FindLawyerFiltersProvider>
  );
}
