import FiltersControl from "@/components/client-lawyer/client/find-lawyer/filters-control";
import ListOfLawyers from "@/components/client-lawyer/client/find-lawyer/list-of-lawyers";
import QuerySearchAndTitle from "@/components/client-lawyer/client/find-lawyer/query-search-and-title";
import { http } from "@/lib/http";
import { Lawyer } from "@/types/client/find-lawyer";
import { Meta } from "@/types/shared";

export default async function Page() {
  const { data, ok } = await http.get<{
    data: Lawyer[];
    meta: Meta;
  }>("/api/lawyers");

  if (!ok) {
    throw new Error("Failed to fetch lawyers");
  }
  // console.log(data, ok);
  return (
    <div className="space-y-6">
      <QuerySearchAndTitle />

      <div className="flex gap-5">
        <div className="w-60 shrink-0 sticky top-6 hidden lg:block">
          <FiltersControl />
        </div>

        <div className="flex-1">
          <ListOfLawyers lawyers={data.data} pagination={data.meta} />
        </div>
      </div>
    </div>
  );
}
