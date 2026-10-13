import type { Metadata } from "next";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import { CaseDetails } from "@/types/lawyer/my-cases";
import ListOfCases from "@/components/client-lawyer/lawyer/my-cases/list-of-cases";

type SearchParams = {
  page?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.MyCases");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page } = await searchParams;

  const { data } = await http.get<{
    data: CaseDetails[];
    meta: Meta;
  }>("/api/lawyer/my-cases", {
    params: {
      page: page || "1",
    },
  });

  return <ListOfCases cases={data.data} pagination={data.meta} />;
}
