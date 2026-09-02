import QuerySearchAndTitle from "@/components/client-lawyer/lawyer/browse-cases/query-search-and-title";
import { http } from "@/lib/http";
import { CaseDetails } from "@/types/client/cases";

export default async function Page() {
  const { data, ok } = await http.get<{
    data: CaseDetails[];
  }>("/api/lawyer/cases");

  if (!ok) {
    throw new Error("Failed to fetch lawyer cases");
  }

  console.log(data.data);

  return (
    <div className="space-y-6">
      <QuerySearchAndTitle />
    </div>
  );
}
