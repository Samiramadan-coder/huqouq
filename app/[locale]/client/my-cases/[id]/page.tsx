import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { Meta } from "@/types/shared";
import { notFound } from "next/navigation";
import { http, HttpError } from "@/lib/http";
import { LoaderPinwheelIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import Index from "@/components/client-lawyer/client/cases/details";
import { CaseDetails, CaseOffer, Step } from "@/types/client/my-cases";

type Params = {
  id: string;
};

type SearchParams = {
  page?: string;
};

// Shared between generateMetadata and the page so the case is fetched once.
// Returns null when the case does not exist or belongs to someone else.
const getCase = cache(async (id: string) => {
  if (!/^\d+$/.test(id)) return null;

  try {
    const { data } = await http.get<{ data: CaseDetails }>(`/api/cases/${id}`, {
      next: {
        tags: [`case-${id}`],
      },
    });

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
  const t = await getTranslations("Client.Cases");
  const caseDetails = await getCase(id);

  return {
    title: `${caseDetails?.title ?? t("caseNotFound")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

async function SingleCase({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { page } = await searchParams;

  const caseDetails = await getCase(id);

  if (!caseDetails) {
    notFound();
  }

  // Fetch the case offers and timeline concurrently
  const [{ data: offers }, { data: timeline }] = await Promise.all([
    http.get<{
      data: CaseOffer[];
      meta: Meta;
    }>(`/api/cases/${id}/offers`, {
      params: {
        page: page || "1",
      },
      next: {
        tags: [`case-${id}-offers`],
      },
    }),
    http.get<{
      data: { steps: Step[] };
    }>(`/api/cases/${id}/timeline`, {
      next: {
        tags: [`case-${id}-timeline`],
      },
    }),
  ]);

  return (
    <Index
      caseDetails={caseDetails}
      offers={offers.data}
      pagination={offers.meta}
      timeline={timeline.data.steps}
    />
  );
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("Client.Cases");

  return (
    <div className="container max-w-3xl space-y-6 py-10">
      <BackBtn>
        <span>{t("backToCases")}</span>
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
        <SingleCase params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
