import React from "react";
import { LawyerDetails } from "@/types/client/find-lawyer";
import DefinitionCard from "./definition-card";
import Details from "./details";

export default function LawyerDetailsPreview({
  lawyer,
  ratingBreakdown,
}: {
  lawyer: LawyerDetails;
  ratingBreakdown: Record<string, number>;
}) {
  console.log(lawyer);
  return (
    <div className="grid items-start grid-cols-1 sm:grid-cols-3 gap-8">
      <DefinitionCard lawyer={lawyer} />

      <div className="sm:col-span-2">
        <Details lawyer={lawyer} ratingBreakdown={ratingBreakdown} />
      </div>
    </div>
  );
}
