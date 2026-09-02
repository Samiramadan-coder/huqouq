import { http } from "@/lib/http";
import QuerySearchAndTitle from "@/components/client-lawyer/lawyer/browse-cases/query-search-and-title";
import FiltersControl from "@/components/client-lawyer/lawyer/browse-cases/filters-control";
import { CaseDetails, Filters } from "@/types/lawyer/browse-cases";
import { LawyerBrowseCasesFiltersProvider } from "@/providers/lawyer-browse-cases-filters";
import ListOfCases from "@/components/client-lawyer/lawyer/browse-cases/list-of-cases";
import { Meta } from "@/types/shared";

export default async function Page() {
  const { data, ok } = await http.get<{
    data: CaseDetails[];
    filters: Filters;
    meta: Meta;
  }>("/api/lawyer/cases");

  if (!ok) {
    throw new Error("Failed to fetch lawyer cases");
  }

  console.log(data);

  return (
    <LawyerBrowseCasesFiltersProvider
      initialSpecializations={data.filters.my_specialization_ids}
    >
      <div className="space-y-6">
        <QuerySearchAndTitle />

        <div className="flex gap-5">
          <div className="w-60 shrink-0 sticky top-6">
            <FiltersControl filters={data.filters} />
          </div>

          <div className="flex-1">
            <ListOfCases cases={data.data} pagination={data.meta} />
          </div>
        </div>
      </div>
    </LawyerBrowseCasesFiltersProvider>
  );
}
