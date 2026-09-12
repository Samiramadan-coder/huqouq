import { Suspense } from "react";
import { http } from "@/lib/http";
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

async function GetCaseDetails({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { hire } = await searchParams;

  const { data, ok } = await http.get<{
    can_submit_offer: boolean;
    data: CaseDetails;
    profile_status: string;
    submit_offer_blocked_reason: string;
  }>(`/api/lawyer/cases/${id}`);

  if (!ok) {
    throw new Error("Failed to fetch case details");
  }

  console.log(data);

  return <Details caseDetails={data.data} hire={!!hire} />;
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
    <div className="container max-w-5xl space-y-6">
      <BackBtn>
        <span>{t("BackToCases")}</span>
      </BackBtn>

      <Suspense
        fallback={<LoaderPinwheelIcon className="animate-spin text-accent" />}
      >
        <GetCaseDetails params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
