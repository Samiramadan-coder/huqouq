import { Suspense } from "react";
import { http } from "@/lib/http";
import { LoaderPinwheelIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LegalServiceDetails } from "@/types/lawyer/legal-services";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import Details from "@/components/client-lawyer/lawyer/legal-services/details";

type Params = {
  id: string;
};

async function LegalService({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  const { data, ok } = await http.get<{ data: LegalServiceDetails }>(
    `/api/lawyer/legal-services/${id}`,
  );

  if (!ok) {
    throw new Error("Failed to fetch legal service details");
  }

  return <Details service={data.data} />;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const t = await getTranslations("Lawyer.LegalServices.Details");
  return (
    <div className="p-4 sm:px-6">
      <BackBtn>{t("backToServices")}</BackBtn>

      <Suspense
        fallback={<LoaderPinwheelIcon className="animate-spin text-accent" />}
      >
        <LegalService params={params} />
      </Suspense>
    </div>
  );
}
