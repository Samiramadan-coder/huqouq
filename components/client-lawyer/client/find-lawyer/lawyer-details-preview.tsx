import Details from "./details";
import DefinitionCard from "./definition-card";
import { LawyerDetails, Review } from "@/types/client/find-lawyer";

export default function LawyerDetailsPreview({
  lawyer,
  ratingBreakdown,
  reviews,
  caseId,
}: {
  lawyer: LawyerDetails;
  ratingBreakdown: Record<string, number>;
  reviews: Review[];
  caseId?: string;
}) {
  return (
    <div className="grid items-start grid-cols-1 sm:grid-cols-3 gap-8">
      <DefinitionCard lawyer={lawyer} caseId={caseId} />

      <div className="sm:col-span-2">
        <Details
          lawyer={lawyer}
          ratingBreakdown={ratingBreakdown}
          reviews={reviews}
        />
      </div>
    </div>
  );
}
