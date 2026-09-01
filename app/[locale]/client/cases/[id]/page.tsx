import Index from "@/components/client-lawyer/client/casses/details";
import { http } from "@/lib/http";
import { CaseDetails } from "@/types/client/cases";

type Params = {
  id: string;
};

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  console.log(id);

  const { data, ok } = await http.get<{ data: CaseDetails }>(
    `/api/cases/${id}`,
  );

  if (!ok) {
    throw new Error("Failed to fetch case details");
  }

  return (
    <div className="container max-w-3xl space-y-6">
      <Index caseDetails={data.data} />
    </div>
  );
}
