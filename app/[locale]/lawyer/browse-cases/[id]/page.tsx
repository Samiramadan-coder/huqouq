import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { http, HttpError } from "@/lib/http";
import { getTranslations } from "next-intl/server";
import { CaseDetails, MyOffer } from "@/types/lawyer/browse-cases";
import Details from "@/components/client-lawyer/lawyer/browse-cases/details";

type Params = {
  id: string;
};

type SearchParams = {
  hire?: string;
};

type CaseDetailsResponse = {
  can_submit_offer: boolean;
  data: CaseDetails;
  profile_status: string;
  submit_offer_blocked_reason: string | null;
  my_offer: MyOffer | null;
};

// Shared between generateMetadata and the page so the case is fetched once.
// Returns null when the case does not exist.
const getCaseDetails = cache(async (id: string) => {
  if (!/^\d+$/.test(id)) return null;

  try {
    const { data } = await http.get<CaseDetailsResponse>(
      `/api/lawyer/cases/${id}`,
    );

    return data;
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return null;

    throw error;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations("Lawyer.BrowseCases");
  const caseDetails = await getCaseDetails(id);

  return {
    title: `${caseDetails?.data.title ?? t("CaseNotFound")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { hire } = await searchParams;
  const data = await getCaseDetails(id);

  if (!data) {
    notFound();
  }

  return (
    <Details
      caseDetails={data.data}
      hire={!!hire}
      canSubmitOffer={data.can_submit_offer}
      submitOfferBlockedReason={data.submit_offer_blocked_reason}
      myOffer={data.my_offer}
    />
  );
}
