import FiltersControl from "@/components/client-lawyer/lawyer/legal-services/filters-control";
import ListOfLegalServices from "@/components/client-lawyer/lawyer/legal-services/list-of-services";
import QuerySearchAndTitle from "@/components/client-lawyer/lawyer/legal-services/query-search-and-title";
import { http } from "@/lib/http";
import { LegalService } from "@/types/lawyer/legal-services";
import { Meta } from "@/types/shared";
import { LoaderPinwheelIcon } from "lucide-react";
import { Suspense } from "react";

type SearchParams = {
  page?: string;
};

async function GetListOfLegalServices({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page } = await searchParams;

  const { data, ok } = await http.get<{
    data: LegalService[];
    meta: Meta;
  }>("/api/lawyer/legal-services", {
    params: {
      page: page || "1",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch legal services");
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 py-10">
      <QuerySearchAndTitle />

      <div className="flex items-start gap-5">
        <div className="w-60 shrink-0 sticky top-20 hidden lg:block">
          <FiltersControl />
        </div>

        <div className="flex-1">
          <ListOfLegalServices services={data.data} pagination={data.meta} />
        </div>
      </div>
    </div>
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
