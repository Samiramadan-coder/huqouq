import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import { http, HttpError } from "@/lib/http";
import { LoaderPinwheelIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LegalServiceDetails } from "@/types/lawyer/legal-services";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import Details from "@/components/client-lawyer/lawyer/legal-services/details";

type Params = {
  id: string;
};

// Shared between generateMetadata and the page so the request is fetched once.
// Returns null when it does not exist or is not visible to this lawyer.
const getLegalService = cache(async (id: string) => {
  if (!/^\d+$/.test(id)) return null;

  try {
    const { data } = await http.get<{ data: LegalServiceDetails }>(
      `/api/lawyer/legal-services/${id}`,
    );

    return data.data;
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
  const t = await getTranslations("Lawyer.LegalServices.Details");
  const service = await getLegalService(id);

  return {
    title: `${service?.service_type_label ?? t("notFound")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

async function LegalService({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const service = await getLegalService(id);

  if (!service) {
    notFound();
  }

  return <Details service={service} />;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const t = await getTranslations("Lawyer.LegalServices.Details");
  return (
    <div className="p-4 sm:px-6 space-y-6">
      <BackBtn>{t("backToServices")}</BackBtn>

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
        <LegalService params={params} />
      </Suspense>
    </div>
  );
}
