import { http } from "@/lib/http";
import { CaseDetails } from "@/types/lawyer/browse-cases";
import Details from "@/components/client-lawyer/lawyer/browse-cases/details";

type Params = {
  id: string;
};

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  const { data, ok } = await http.get<{
    can_submit_offer: boolean;
    data: CaseDetails;
    profile_status: string;
    submit_offer_blocked_reason: string;
  }>(`/api/lawyer/cases/${id}`);

  if (!ok) {
    throw new Error("Failed to fetch case details");
  }

  return (
    <div className="container max-w-5xl">
      <Details caseDetails={data.data} />
    </div>
  );
}
