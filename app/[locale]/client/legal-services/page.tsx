import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { LoaderPinwheelIcon } from "lucide-react";
import { Counts, LegalService } from "@/types/client/legal-services";
import Filters from "@/components/client-lawyer/client/legal-services/filters";
import SectionTitle from "@/components/client-lawyer/client/legal-services/section-title";
import ListOfServices from "@/components/client-lawyer/client/legal-services/list-of-services";

type SearchParams = {
  tab?: string;
  page?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Client.LegalServices");

  return {
    title: `${t("title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

async function ListOfLegalServices({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, tab } = await searchParams;

  const { data } = await http.get<{
    data: LegalService[];
    meta: Meta;
    counts: Counts;
  }>("/api/legal-services", {
    params: {
      page: page ?? "1",
      tab: tab ?? "",
    },
    next: {
      tags: ["client-legal-services"],
    },
  });

  return (
    <div className=" space-y-4">
      <Filters counts={data.counts} />
      <ListOfServices services={data.data} pagination={data.meta} />
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="py-10 container max-w-7xl space-y-6">
      <SectionTitle />

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
        <ListOfLegalServices searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
