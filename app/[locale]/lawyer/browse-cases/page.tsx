import type { Metadata } from "next";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { LoaderPinwheelIcon, MoveRight, TriangleAlert } from "lucide-react";
import { Case, Filters } from "@/types/lawyer/browse-cases";
import ListOfCases from "@/components/client-lawyer/lawyer/browse-cases/list-of-cases";
import { LawyerBrowseCasesFiltersProvider } from "@/providers/lawyer-browse-cases-filters";
import FiltersControl from "@/components/client-lawyer/lawyer/browse-cases/filters-control";
import QuerySearchAndTitle from "@/components/client-lawyer/lawyer/browse-cases/query-search-and-title";
import { Suspense } from "react";

type SearchParams = {
  page?: string;
  specialization_id?: string;
  emirate?: string;
  urgency?: string;
  sort?: string;
  q?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.BrowseCases");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

async function GetListOfCases({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("Lawyer.BrowseCases");
  const { page, specialization_id, emirate, urgency, sort, q } =
    await searchParams;

  const { data } = await http.get<{
    data: Case[];
    filters: Filters;
    meta: Meta;
    can_submit_offer: boolean;
    profile_status: string;
    submit_offer_blocked_reason: string | null;
  }>("/api/lawyer/cases", {
    params: {
      page: page || "1",
      specialization_id: specialization_id || "",
      emirate: emirate || "",
      urgency: urgency || "",
      sort: sort || "",
      // The API reads the sort order from `sort`
      // ...(sort ? { sort: sort } : {}),
      q: q || "",
    },
  });

  return (
    <LawyerBrowseCasesFiltersProvider>
      <div className="space-y-6 px-4 sm:px-6 py-10">
        <QuerySearchAndTitle />

        {data.can_submit_offer === false && (
          <div
            role="status"
            className="flex items-center justify-between gap-4 flex-wrap text-[13px] px-4 py-3 border border-amber-200 bg-amber-50 text-amber-700"
          >
            <div className="flex items-center gap-2">
              <TriangleAlert
                className="text-amber-700 size-4 shrink-0"
                aria-hidden="true"
              />
              {data.submit_offer_blocked_reason}
            </div>

            <Button
              asChild
              variant="outline"
              className="ms-auto h-9 text-[13px] text-amber-700 border-amber-200 rounded-xs bg-transparent hover:text-amber-700 hover:bg-transparent"
            >
              <Link href="/lawyer/profile" className="flex items-center gap-2">
                {t("CompleteProfile")}
                <MoveRight
                  className="size-4 rtl:rotate-180"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        )}

        <div className="flex items-start gap-5">
          <div className="w-60 shrink-0 sticky top-20 hidden lg:block">
            <FiltersControl filters={data.filters} />
          </div>

          <div className="flex-1 min-w-0">
            <ListOfCases
              cases={data.data}
              pagination={data.meta}
              can_submit_offer={data.can_submit_offer}
              filters={data.filters}
            />
          </div>
        </div>
      </div>
    </LawyerBrowseCasesFiltersProvider>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
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
      <GetListOfCases searchParams={searchParams} />
    </Suspense>
  );
}
