import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import { http, HttpError } from "@/lib/http";
import { redirect } from "@/i18n/navigation";
import { LoaderPinwheelIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { ServiceDetails } from "@/types/lawyer/active-services";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import Index from "@/components/client-lawyer/lawyer/active-services/details";

type Params = {
  id: string;
};

// Shared between generateMetadata and the page so the service is fetched once.
// Returns null when it does not exist or is not visible to this lawyer.
const getService = cache(async (id: string) => {
  if (!/^\d+$/.test(id)) return null;

  try {
    const { data } = await http.get<{ data: ServiceDetails }>(
      `/api/lawyer/legal-services/${id}`,
      {
        next: { tags: [`lawyer-legal-service-${id}`] },
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
  const t = await getTranslations("Lawyer.ActiveServices.Details");
  const service = await getService(id);

  return {
    title: `${service?.service_type_label ?? t("notFound")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

async function ActiveServiceDetails({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    notFound();
  }

  // Until an offer is accepted the API returns the request without the
  // timeline, earnings and deliveries this page needs, so send the lawyer
  // to the request page instead.
  if (!service.timeline || !service.earnings) {
    return redirect({
      href: `/lawyer/services/${service.id}`,
      locale: await getLocale(),
    });
  }

  return <Index service={service} />;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const t = await getTranslations("Lawyer.ActiveServices");

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <BackBtn>{t("Details.backToServices")}</BackBtn>

      <Suspense
        fallback={
          <div className="p-4 sm:p-6" role="status" aria-label="Loading">
            <LoaderPinwheelIcon
              className="animate-spin text-accent"
              aria-hidden="true"
            />
          </div>
        }
      >
        <ActiveServiceDetails params={params} />
      </Suspense>
    </div>
  );
}
