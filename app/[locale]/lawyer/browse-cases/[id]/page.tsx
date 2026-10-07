import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import { http, HttpError } from "@/lib/http";
import { LoaderPinwheelIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CaseDetails } from "@/types/lawyer/browse-cases";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
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

async function GetCaseDetails({
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
    />
  );
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("Lawyer.BrowseCases");

  return (
    <div className="container max-w-5xl space-y-6 py-10">
      <BackBtn>
        <span>{t("BackToCases")}</span>
      </BackBtn>

      <Suspense
        fallback={
          <div role="status" aria-label="Loading">
            <LoaderPinwheelIcon
              className="animate-spin text-accent"
              aria-hidden="true"
            />
          </div>
        }
      >
        <GetCaseDetails params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
