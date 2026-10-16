import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import type { Counts, Consultation } from "@/types/client/consultation";
import Filters from "@/components/client-lawyer/client/consultations/filters";
import DataPreview from "@/components/client-lawyer/client/consultations/data-preview";

type SearchParams = {
  status?: string;
  page?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status, page } = await searchParams;

  const { data } = await http.get<{
    meta: Meta;
    counts: Counts;
    data: Consultation[];
  }>("/api/consultations", {
    params: {
      status: status ?? "",
      page: page ?? "",
    },
    next: {
      tags: ["consultations"],
    },
  });

  console.log(data.data);

  return (
    <div>
      <Filters counts={data.counts} />
      <DataPreview data={data.data} pagination={data.meta} />
    </div>
  );
}
