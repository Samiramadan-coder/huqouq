import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { Meta } from "@/types/shared";
import { notFound } from "next/navigation";
import { http, HttpError } from "@/lib/http";
import { LoaderPinwheelIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LawyerDetails, Review } from "@/types/client/find-lawyer";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import LawyerDetailsPreview from "@/components/client-lawyer/client/find-lawyer/lawyer-details-preview";

type Params = {
  id: string;
};

type SearchParams = {
  caseId?: string;
  page?: string;
};

// Shared between generateMetadata and the page so the profile is fetched once.
// Returns null when the lawyer does not exist.
const getLawyer = cache(async (id: string) => {
  if (!/^\d+$/.test(id)) return null;

  try {
    const { data } = await http.get<{
      data: LawyerDetails;
      rating_breakdown: Record<string, number>;
    }>(`/api/lawyers/${id}`);

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
  const t = await getTranslations("Client.FindLawyer");
  const lawyer = await getLawyer(id);

  return {
    title: `${lawyer?.data.name ?? t("lawyerNotFound")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

async function GetLawyerDetails({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { caseId, page } = await searchParams;

  // Start both requests together; the profile decides whether the page exists
  const reviewsRequest = /^\d+$/.test(id)
    ? http
        .get<{
          data: Review[];
          meta: Meta;
        }>(`/api/lawyers/${id}/reviews`, {
          params: { page: page || "1" },
        })
        .catch((error: unknown) => {
          if (error instanceof HttpError && error.status === 404) return null;

          throw error;
        })
    : null;

  const [lawyerDetails, reviews] = await Promise.all([
    getLawyer(id),
    reviewsRequest,
  ]);

  if (!lawyerDetails) {
    notFound();
  }

  return (
    <LawyerDetailsPreview
      lawyer={lawyerDetails.data}
      ratingBreakdown={lawyerDetails.rating_breakdown}
      reviews={reviews?.data.data ?? []}
      reviewsPagination={reviews?.data.meta}
      caseId={caseId}
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
  const t = await getTranslations("Client.FindLawyer");

  return (
    <div className="container max-w-5xl space-y-6 py-10">
      <BackBtn>{t("backToFindLawyers")}</BackBtn>

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
        <GetLawyerDetails params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
