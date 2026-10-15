import { http } from "@/lib/http";
import type { Metadata } from "next";
import { Meta } from "@/types/shared";
import { getTranslations } from "next-intl/server";
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

export default async function Page({
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
    <div className="py-10 container max-w-7xl space-y-6">
      <SectionTitle />
      <div className=" space-y-4">
        <Filters counts={data.counts} />
        <ListOfServices services={data.data} pagination={data.meta} />
      </div>
    </div>
  );
}
