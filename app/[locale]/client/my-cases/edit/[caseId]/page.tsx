import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { http, HttpError } from "@/lib/http";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { CaseDetails } from "@/types/client/my-cases";
import Form from "@/components/client-lawyer/client/cases/form";

type Params = {
  caseId: string;
};

// Fetch a single case by its ID, returns null if not found or invalid ID
async function getCase(caseId: string) {
  if (!/^\d+$/.test(caseId)) return null;

  try {
    const { data } = await http.get<{ data: CaseDetails }>(
      `/api/cases/${caseId}`,
    );

    return data.data;
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return null;

    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { caseId } = await params;
  const caseItem = await getCase(caseId);

  return {
    title: `${caseItem?.title} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function page({ params }: { params: Promise<Params> }) {
  const { caseId } = await params;
  const caseItem = await getCase(caseId);

  if (!caseItem) {
    notFound();
  }

  // The API decides when a case may still be edited
  if (!caseItem.can_edit) {
    return redirect({
      href: `/client/my-cases/${caseItem.id}`,
      locale: await getLocale(),
    });
  }

  return <Form caseItem={caseItem} />;
}
