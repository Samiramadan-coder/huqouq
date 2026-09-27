import { Suspense } from "react";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { LoaderPinwheelIcon, MoveRight, TriangleAlert } from "lucide-react";
import { Filters, LegalService } from "@/types/lawyer/legal-services";
import FiltersControl from "@/components/client-lawyer/lawyer/legal-services/filters-control";
import { LawyerBrowseServicesFiltersProvider } from "@/providers/lawyer-browse-services-filters";
import ListOfLegalServices from "@/components/client-lawyer/lawyer/legal-services/list-of-services";
import QuerySearchAndTitle from "@/components/client-lawyer/lawyer/legal-services/query-search-and-title";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type SearchParams = {
  page?: string;
  service_type?: string;
  urgencies?: string;
  emirates?: string;
  q?: string;
  sorts?: string;
};

async function GetListOfLegalServices({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("Lawyer.LegalServices");
  const { page, service_type, urgencies, emirates, q, sorts } =
    await searchParams;

  const { data, ok } = await http.get<{
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
      sorts: sorts || "",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch legal services");
  }

  return (
    <LawyerBrowseServicesFiltersProvider>
      <div className="space-y-6 px-4 sm:px-6 py-10">
        <QuerySearchAndTitle />

        {data.can_submit_offer === false && (
          <div className="flex items-center justify-between gap-4 flex-wrap text-[13px] px-4 py-3 border border-amber-200 bg-amber-50 text-amber-700">
            <div className="flex items-center gap-2">
              <TriangleAlert className="text-amber-700 size-4" />
              {data.submit_offer_blocked_reason}
            </div>

            <Button
              asChild
              variant="outline"
              className="ms-auto h-9 text-[13px] text-amber-700 border-amber-200 rounded-xs bg-transparent hover:text-amber-700 hover:bg-transparent"
            >
              <Link href="/lawyer/profile" className="flex items-center gap-2">
                {t("completeProfile")}
                <MoveRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        )}

        <div className="flex items-start gap-5">
          <div className="w-60 shrink-0 sticky top-20 hidden lg:block">
            <FiltersControl filters={data.filters} />
          </div>

          <div className="flex-1">
            <ListOfLegalServices
              services={data.data}
              pagination={data.meta}
              filters={data.filters}
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
        <div className="p-4 sm:p-6">
          <LoaderPinwheelIcon className="animate-spin text-accent" />
        </div>
      }
    >
      <GetListOfLegalServices searchParams={searchParams} />
    </Suspense>
  );
}
