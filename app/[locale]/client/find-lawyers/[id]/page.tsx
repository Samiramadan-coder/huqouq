import { Suspense } from "react";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { LoaderPinwheelIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LawyerDetails, Review } from "@/types/client/find-lawyer";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import LawyerDetailsPreview from "@/components/client-lawyer/client/find-lawyer/lawyer-details-preview";

type Params = {
  id: string;
};

async function GetLawyerDetails({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  // Fetch lawyer details and reviews concurrently
  const { data: lawyerDetails, ok: ok1 } = await http.get<{
    data: LawyerDetails;
    rating_breakdown: Record<string, number>;
  }>(`/api/lawyers/${id}`);

  // Fetch reviews for the lawyer
  const { data: reviews, ok: ok2 } = await http.get<{
    data: Review[];
    meta: Meta;
  }>(`/api/lawyers/${id}/reviews`);

  if (!ok1 || !ok2) {
    throw new Error("Failed to fetch lawyer details or reviews");
  }

  return (
    <LawyerDetailsPreview
      lawyer={lawyerDetails.data}
      ratingBreakdown={lawyerDetails.rating_breakdown}
      reviews={reviews.data}
    />
  );
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const t = await getTranslations("Client.FindLawyer");

  return (
    <div className="container max-w-5xl space-y-6">
      <BackBtn>{t("backToFindLawyers")}</BackBtn>

      <Suspense
        fallback={<LoaderPinwheelIcon className="animate-spin text-accent" />}
      >
        <GetLawyerDetails params={params} />
      </Suspense>
    </div>
  );
}
