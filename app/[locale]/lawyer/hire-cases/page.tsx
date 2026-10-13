import { http } from "@/lib/http";
import type { Metadata } from "next";
import { Meta } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import { Case } from "@/types/lawyer/browse-cases";
import CaseCard from "@/components/client-lawyer/lawyer/browse-cases/case-card";
import PaginationTemplate from "@/components/client-lawyer/reusable/pagination-template";

type SearchParams = {
  page?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.BrowseCases");

  return {
    title: `${t("hireCases")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("Lawyer.BrowseCases");
  const { page } = await searchParams;

  const { data } = await http.get<{
    meta: Meta;
    data: Case[];
  }>("/api/lawyer/hire-requests", {
    params: {
      page: page || "1",
    },
    next: {
      tags: ["lawyer-hire-requests"],
    },
  });

  return (
    <div className="space-y-4">
      {data.data.length > 0 ? (
        data.data.map((caseItem) => (
          <CaseCard
            key={caseItem.id}
            caseItem={caseItem}
            can_submit_offer={true}
            isHireCase={true}
          />
        ))
      ) : (
        <p className="text-sm text-primary/50">{t("NoHireCasesFound")}</p>
      )}

      {data.meta.last_page > 1 && (
        <PaginationTemplate
          currentPage={data.meta.current_page}
          totalPages={data.meta.last_page}
        />
      )}
    </div>
  );
}
