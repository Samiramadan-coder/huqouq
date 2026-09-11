import { Suspense } from "react";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { LoaderPinwheelIcon } from "lucide-react";
import { Lawyer } from "@/types/client/find-lawyer";
import ListOfLawyers from "@/components/client-lawyer/client/find-lawyer/list-of-lawyers";
import FiltersControl from "@/components/client-lawyer/client/find-lawyer/filters-control";
import QuerySearchAndTitle from "@/components/client-lawyer/client/find-lawyer/query-search-and-title";

type SerachParams = {
  page?: string;
  caseId?: string;
};

async function GetListOfLawyers({
  searchParams,
}: {
  searchParams: Promise<SerachParams>;
}) {
  const { page, caseId } = await searchParams;

  const { data, ok } = await http.get<{
    data: Lawyer[];
    meta: Meta;
  }>("/api/lawyers", {
    params: {
      page: page || "1",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch lawyers");
  }

  return (
    <div className="flex gap-5">
      <div className="w-60 shrink-0 sticky top-6 hidden lg:block">
        <FiltersControl />
      </div>

      <div className="flex-1">
        <ListOfLawyers
          lawyers={data.data}
          pagination={data.meta}
          caseId={caseId}
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
    <div className="space-y-6">
      <QuerySearchAndTitle />

      <Suspense
        fallback={<LoaderPinwheelIcon className="animate-spin text-accent" />}
      >
        <GetListOfLawyers searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
