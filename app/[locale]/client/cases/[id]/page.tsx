import Index from "@/components/client-lawyer/client/cases/details";
import { http } from "@/lib/http";
import { CaseDetails, CaseOffer } from "@/types/client/cases";
import { Meta } from "@/types/shared";

type Params = {
  id: string;
};

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  const { data: caseData, ok: ok1 } = await http.get<{
    data: CaseDetails;
  }>(`/api/cases/${id}`);

  const { data: offers, ok: ok2 } = await http.get<{
    data: CaseOffer[];
    meta: Meta;
  }>(`/api/cases/${id}/offers`);

  if (!ok1 || !ok2) {
    throw new Error("Failed to fetch case details");
  }

  // console.log(offers);

  return (
    <div className="container max-w-3xl space-y-6">
      <Index
        caseDetails={caseData.data}
        offers={offers.data}
        pagination={offers.meta}
      />
    </div>
  );
}
