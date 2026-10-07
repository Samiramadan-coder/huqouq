import Details from "./details";
import DefinitionCard from "./definition-card";
import { Meta } from "@/types/shared";
import { LawyerDetails, Review } from "@/types/client/find-lawyer";

export default function LawyerDetailsPreview({
  lawyer,
  ratingBreakdown,
  reviews,
  reviewsPagination,
  caseId,
}: {
  lawyer: LawyerDetails;
  ratingBreakdown: Record<string, number>;
  reviews: Review[];
  reviewsPagination?: Meta;
  caseId?: string;
}) {
  return (
    <div className="grid items-start grid-cols-1 sm:grid-cols-3 gap-8">
      <DefinitionCard lawyer={lawyer} caseId={caseId} />

      <div className="sm:col-span-2 min-w-0">
        <Details
          lawyer={lawyer}
          ratingBreakdown={ratingBreakdown}
          reviews={reviews}
          reviewsPagination={reviewsPagination}
        />
      </div>
    </div>
  );
}
