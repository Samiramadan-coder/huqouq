import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import { http, HttpError } from "@/lib/http";
import { LoaderPinwheelIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LegalServiceDetails } from "@/types/client/legal-services";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import Index from "@/components/client-lawyer/client/legal-services/details";

type Params = {
  id: string;
};

// Shared between generateMetadata and the page so the request is fetched once.
// Returns null when it does not exist or belongs to someone else.
const getLegalService = cache(async (id: string) => {
  if (!/^\d+$/.test(id)) return null;

  try {
    const { data } = await http.get<{ data: LegalServiceDetails }>(
      `/api/legal-services/${id}`,
      {
        next: {
          tags: [`client-legal-service-${id}`],
        },
      },
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
  const t = await getTranslations("Client.LegalServices");
  const legalService = await getLegalService(id);

  return {
    title: `${legalService?.service_type_label ?? t("notFound")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

async function LegalService({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const legalService = await getLegalService(id);

  if (!legalService) {
    notFound();
  }

  return <Index legalService={legalService} />;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const t = await getTranslations("Client.LegalServices");

  return (
    <div className="container max-w-7xl py-10">
      <BackBtn>
        <span>{t("backToLegal")}</span>
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
        <LegalService params={params} />
      </Suspense>
    </div>
  );
}
