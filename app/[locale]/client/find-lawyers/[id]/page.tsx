import { http } from "@/lib/http";
import { getTranslations } from "next-intl/server";
import { LawyerDetails } from "@/types/client/find-lawyer";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import LawyerDetailsPreview from "@/components/client-lawyer/client/find-lawyer/lawyer-details-preview";

type Params = {
  id: string;
};

export default async function Page({ params }: { params: Promise<Params> }) {
  const t = await getTranslations("Client.FindLawyer");
  const { id } = await params;

  const { data, ok } = await http.get<{
    data: LawyerDetails;
    rating_breakdown: Record<string, number>;
  }>(`/api/lawyers/${id}`);

  if (!ok) {
    throw new Error("Failed to fetch lawyer details");
  }

  return (
    <div className="container max-w-5xl space-y-6">
      <BackBtn>{t("backToFindLawyers")}</BackBtn>
      <LawyerDetailsPreview lawyer={data.data} />
    </div>
  );
}
