import { http } from "@/lib/http";
import { CaseDetails } from "@/types/client/cases";
import QuerySearchAndTitle from "@/components/client-lawyer/lawyer/browse-cases/query-search-and-title";
import FiltersControl from "@/components/client-lawyer/lawyer/browse-cases/filters-control";
import { Filters } from "@/types/lawyer/browse-cases";
import { LawyerBrowseCasesFiltersProvider } from "@/providers/lawyer-browse-cases-filters";

export default async function Page() {
  const { data, ok } = await http.get<{
    data: CaseDetails[];
    filters: Filters;
  }>("/api/lawyer/cases");

  if (!ok) {
    throw new Error("Failed to fetch lawyer cases");
  }

  console.log(data);

  return (
    <LawyerBrowseCasesFiltersProvider>
      <div className="space-y-6">
        <QuerySearchAndTitle />

        <div className="flex gap-5">
          <div className="w-60 shrink-0 sticky top-6">
            <FiltersControl filters={data.filters} />
          </div>
          <div className="flex-1">2</div>
        </div>
      </div>
    </LawyerBrowseCasesFiltersProvider>
  );
}
