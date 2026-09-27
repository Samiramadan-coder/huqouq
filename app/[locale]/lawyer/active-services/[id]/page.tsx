import { Suspense } from "react";
import { http } from "@/lib/http";
import { LoaderPinwheelIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ServiceDetails } from "@/types/lawyer/active-services";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import Index from "@/components/client-lawyer/lawyer/active-services/details";

type Params = {
  id: string;
};

async function ActiveServiceDetails({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  const { data, ok } = await http.get<{ data: ServiceDetails }>(
    `/api/lawyer/legal-services/${id}`,
  );

  if (!ok) {
    throw new Error("Failed to fetch service details");
  }

  console.log(data);

  return <Index service={data.data} />;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const t = await getTranslations("Lawyer.ActiveServices");

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <BackBtn>{t("Details.backToServices")}</BackBtn>

      <Suspense
        fallback={
          <div className="p-4 sm:p-6">
            <LoaderPinwheelIcon className="animate-spin text-accent" />
          </div>
        }
      >
        <ActiveServiceDetails params={params} />
      </Suspense>
    </div>
  );
}
