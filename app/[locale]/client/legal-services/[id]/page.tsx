import { Suspense } from "react";
import { http } from "@/lib/http";
import { LoaderPinwheelIcon } from "lucide-react";
import { LegalServiceDetails } from "@/types/client/legal-services";
import Index from "@/components/client-lawyer/client/legal-services/details";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import { getTranslations } from "next-intl/server";

type Params = {
  id: string;
};

async function LegalService({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  const { data, ok } = await http.get<{ data: LegalServiceDetails }>(
    `/api/legal-services/${id}`,
    {
      next: {
        tags: [`client-legal-service-${id}`],
      },
    },
  );

  if (!ok) {
    throw new Error("Failed to fetch legal service details");
  }

  console.log(data.data);

  return <Index legalService={data.data} />;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const t = await getTranslations("Client.LegalServices");

  return (
    <div className="container max-w-4xl py-10">
      <BackBtn>
        <span>{t("backToLegal")}</span>
      </BackBtn>

      <Suspense
        fallback={<LoaderPinwheelIcon className="animate-spin text-accent" />}
      >
        <LegalService params={params} />
      </Suspense>
    </div>
  );
}
