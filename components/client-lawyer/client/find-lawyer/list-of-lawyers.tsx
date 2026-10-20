import { Meta } from "@/types/shared";
import LawyerCard from "./lawyer-card";
import { getTranslations } from "next-intl/server";
import ListOfLawyersHeader from "./list-of-lawyers-header";
import LawyersPendingRegion from "./lawyers-pending-region";
import { Filters, Lawyer } from "@/types/client/find-lawyer";
import PaginationTemplate from "../../reusable/pagination-template";

export default async function ListOfLawyers({
  lawyers,
  pagination,
  caseId,
  filters,
}: {
  lawyers: Lawyer[];
  pagination: Meta;
  caseId?: string;
  filters: Filters;
}) {
  const t = await getTranslations("Client.FindLawyer");

  return (
    <div className="space-y-3">
      <ListOfLawyersHeader total={pagination.total} filters={filters} />

      <LawyersPendingRegion>
        {lawyers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lawyers.map((lawyer, index) => (
              <LawyerCard
                key={lawyer.id}
                lawyer={lawyer}
                index={index}
                caseId={caseId}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-primary/50">{t("noLawyersFound")}</p>
        )}

        {pagination.last_page > 1 && (
          <PaginationTemplate
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
          />
        )}
      </LawyersPendingRegion>
    </div>
  );
}
