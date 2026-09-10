import CaseCard from "./case-card";
import { Meta } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import ListOfCasesHeader from "./list-of-cases-header";
import { Case, Filters } from "@/types/lawyer/browse-cases";
import PaginationTemplate from "../../reusable/pagination-template";

export default async function ListOfCases({
  cases,
  pagination,
  can_submit_offer,
  filters,
}: {
  cases: Case[];
  pagination: Meta;
  can_submit_offer: boolean;
  filters: Filters;
}) {
  const t = await getTranslations("Lawyer.BrowseCases");

  return (
    <div className="space-y-3">
      <ListOfCasesHeader total={pagination.total} filters={filters} />

      {cases.length > 0 ? (
        <>
          {cases.map((caseItem) => (
            <CaseCard
              key={caseItem.id}
              can_submit_offer={can_submit_offer}
              caseItem={caseItem}
            />
          ))}

          <PaginationTemplate
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
          />
        </>
      ) : (
        <p className="text-sm text-primary/50">{t("noCasesFound")}</p>
      )}
    </div>
  );
}
