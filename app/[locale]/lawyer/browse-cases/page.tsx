import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { MoveRight, TriangleAlert } from "lucide-react";
import { CaseDetails, Filters } from "@/types/lawyer/browse-cases";
import ListOfCases from "@/components/client-lawyer/lawyer/browse-cases/list-of-cases";
import { LawyerBrowseCasesFiltersProvider } from "@/providers/lawyer-browse-cases-filters";
import FiltersControl from "@/components/client-lawyer/lawyer/browse-cases/filters-control";
import QuerySearchAndTitle from "@/components/client-lawyer/lawyer/browse-cases/query-search-and-title";

export default async function Page() {
  const t = await getTranslations("Lawyer.BrowseCases");

  const { data, ok } = await http.get<{
    data: CaseDetails[];
    filters: Filters;
    meta: Meta;
    can_submit_offer: boolean;
    profile_status: string;
    submit_offer_blocked_reason: string;
  }>("/api/lawyer/cases");

  if (!ok) {
    throw new Error("Failed to fetch lawyer cases");
  }

  return (
    <LawyerBrowseCasesFiltersProvider
      initialSpecializations={data.filters.my_specialization_ids}
    >
      <div className="space-y-6">
        <QuerySearchAndTitle />

        {data.can_submit_offer === false && (
          <div className="flex items-center justify-between gap-2 text-[13px] px-4 py-3 border border-amber-200 bg-amber-50 text-amber-700">
            <div className="flex items-center gap-2">
              <TriangleAlert className="text-amber-700 size-4" />
              {data.submit_offer_blocked_reason}
            </div>

            <Button
              asChild
              variant="outline"
              className="h-9 text-[13px] text-amber-700 border-amber-200 rounded-xs bg-transparent hover:text-amber-700 hover:bg-transparent"
            >
              <Link href="/lawyer/profile" className="flex items-center gap-2">
                {t("CompleteProfile")}
                <MoveRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        )}

        <div className="flex gap-5">
          <div className="w-60 shrink-0 sticky top-6">
            <FiltersControl filters={data.filters} />
          </div>

          <div className="flex-1">
            <ListOfCases
              cases={data.data}
              pagination={data.meta}
              can_submit_offer={data.can_submit_offer}
            />
          </div>
        </div>
      </div>
    </LawyerBrowseCasesFiltersProvider>
  );
}
