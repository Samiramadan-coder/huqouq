import { Suspense } from "react";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { LoaderPinwheelIcon } from "lucide-react";
import { Counts, LegalService } from "@/types/client/legal-services";
import Filters from "@/components/client-lawyer/client/legal-services/filters";
import SectionTitle from "@/components/client-lawyer/client/legal-services/section-title";
import ListOfServices from "@/components/client-lawyer/client/legal-services/list-of-services";

type SearchParams = {
  tab?: string;
  page?: string;
};

async function ListOfLegalServices({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, tab } = await searchParams;

  const { data, ok } = await http.get<{
    data: LegalService[];
    meta: Meta;
    counts: Counts;
  }>("/api/legal-services", {
    params: {
      page: page ?? "1",
      tab: tab ?? "",
    },
    next: {
      tags: ["client-legal-services"],
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch legal services");
  }

  return (
    <div className=" space-y-4">
      <Filters counts={data.counts} />
      <ListOfServices services={data.data} pagination={data.meta} />
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="py-10 container max-w-5xl space-y-6">
      <SectionTitle />

      <Suspense
        fallback={<LoaderPinwheelIcon className="animate-spin text-accent" />}
      >
        <ListOfLegalServices searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
