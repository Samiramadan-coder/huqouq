import Index from "@/components/client-lawyer/client/cases/details";
import { http } from "@/lib/http";
import { CaseDetails, CaseOffer } from "@/types/client/cases";
import { Meta } from "@/types/shared";

type Params = {
  id: string;
};

type SearchParams = {
  page?: string;
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { page } = await searchParams;

  // Fetch case details and offers concurrently
  const { data: caseData, ok: ok1 } = await http.get<{
    data: CaseDetails;
  }>(`/api/cases/${id}`, {
    next: {
      tags: [`case-${id}`],
    },
  });

  // Fetch offers for the case with pagination
  const { data: offers, ok: ok2 } = await http.get<{
    data: CaseOffer[];
    meta: Meta;
  }>(`/api/cases/${id}/offers`, {
    params: {
      page: page || "1",
    },
    next: {
      tags: [`case-${id}-offers`],
    },
  });

  if (!ok1 || !ok2) {
    throw new Error("Failed to fetch case details");
  }

  console.log("Case Details:", caseData.data);

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
