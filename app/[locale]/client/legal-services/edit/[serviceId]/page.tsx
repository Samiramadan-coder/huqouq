import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { http, HttpError } from "@/lib/http";
import { redirect } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { LegalServiceDetails } from "@/types/client/legal-services";
import Form from "@/components/client-lawyer/client/legal-services/form";

type Params = {
  serviceId: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Client.LegalServices");

  return {
    title: `${t("edit")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

// Returns null when the request does not exist or belongs to someone else
async function getLegalService(serviceId: string) {
  if (!/^\d+$/.test(serviceId)) return null;

  try {
    const { data } = await http.get<{ data: LegalServiceDetails }>(
      `/api/legal-services/${serviceId}`,
    );

    return data.data;
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return null;

    throw error;
  }
}

export default async function page({ params }: { params: Promise<Params> }) {
  const { serviceId } = await params;
  const legalService = await getLegalService(serviceId);

  if (!legalService) {
    notFound();
  }

  // The API decides when a request may still be edited
  if (!legalService.can.edit) {
    return redirect({
      href: `/client/legal-services/${legalService.id}`,
      locale: await getLocale(),
    });
  }

  return <Form legalServiceItem={legalService} />;
}
