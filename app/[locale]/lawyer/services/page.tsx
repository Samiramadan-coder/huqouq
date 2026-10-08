import { Suspense } from "react";
import type { Metadata } from "next";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { Filters, LegalService } from "@/types/lawyer/legal-services";
import { LoaderPinwheelIcon, MoveRight, TriangleAlert } from "lucide-react";
import FiltersControl from "@/components/client-lawyer/lawyer/legal-services/filters-control";
import { LawyerBrowseServicesFiltersProvider } from "@/providers/lawyer-browse-services-filters";
import ListOfLegalServices from "@/components/client-lawyer/lawyer/legal-services/list-of-services";
import QuerySearchAndTitle from "@/components/client-lawyer/lawyer/legal-services/query-search-and-title";

type SearchParams = {
  page?: string;
  service_type?: string;
  urgencies?: string;
  emirates?: string;
  q?: string;
  sort?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.LegalServices");

  return {
    title: `${t("title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

async function GetListOfLegalServices({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("Lawyer.LegalServices");
  const { page, service_type, urgencies, emirates, q, sort } =
    await searchParams;

  const { data } = await http.get<{
    data: LegalService[];
    meta: Meta;
    filters: Filters;
    can_submit_offer: boolean;
    submit_offer_blocked_reason: null | string;
  }>("/api/lawyer/legal-services", {
    params: {
      page: page || "1",
      service_type: service_type || "",
      urgencies: urgencies || "",
      emirates: emirates || "",
      q: q || "",
      sort: sort || "",
      // The API reads the sort order from `sort`
      // ...(sort ? { sort: sort } : {}),
    },
  });

  return (
    <LawyerBrowseServicesFiltersProvider>
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
                {t("completeProfile")}
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
            <ListOfLegalServices
              services={data.data}
              pagination={data.meta}
              filters={data.filters}
              can_submit_offer={data.can_submit_offer}
            />
          </div>
        </div>
      </div>
    </LawyerBrowseServicesFiltersProvider>
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
      <GetListOfLegalServices searchParams={searchParams} />
    </Suspense>
  );
}
