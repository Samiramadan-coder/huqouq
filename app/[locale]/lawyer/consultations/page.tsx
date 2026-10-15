import { Metadata } from "next";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import { Consultation, Counts } from "@/types/lawyer/consultations";
import Filters from "@/components/client-lawyer/lawyer/consultations/filters";
import DataPreview from "@/components/client-lawyer/lawyer/consultations/data-preview";

type SearchParams = {
  page?: string;
  status?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.Consultations.Bookings");
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
  const { page, status } = await searchParams;

  const { data } = await http.get<{
    counts: Counts;
    data: Consultation[];
    meta: Meta;
  }>("/api/lawyer/consultations", {
    params: {
      page: page ?? "1",
      status: status ?? "",
    },
    next: {
      tags: ["lawyer-consultations"],
    },
  });

  return (
    <div>
      <Filters counts={data.counts} />
      <DataPreview data={data.data} pagination={data.meta} />
    </div>
  );
}
