import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import { Case } from "@/types/lawyer/browse-cases";
import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";
import CaseCard from "@/components/client-lawyer/lawyer/browse-cases/case-card";
import PaginationTemplate from "@/components/client-lawyer/reusable/pagination-template";

type SearchParams = {
  page?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("Lawyer.BrowseCases");
  const { page } = await searchParams;

  const { data, ok } = await http.get<{
    meta: Meta;
    data: Case[];
  }>("/api/lawyer/hire-requests", {
    params: {
      page: page || "1",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch lawyer cases");
  }

  return (
    <div className="container max-w-5xl space-y-6">
      <div>
        <Title>{t("hireCases")}</Title>
        <Hint>{t("hireCasesDescription")}</Hint>
      </div>

      {data.data.length > 0 ? (
        <div className="space-y-4">
          {data.data.map((caseItem) => (
            <CaseCard
              key={caseItem.id}
              caseItem={caseItem}
              can_submit_offer={true}
              isHireCase={true}
            />
          ))}

          <PaginationTemplate
            currentPage={data.meta.current_page}
            totalPages={data.meta.last_page}
          />
        </div>
      ) : (
        <p className="text-sm text-primary/50">{t("NoHireCasesFound")}</p>
      )}
    </div>
  );
}
