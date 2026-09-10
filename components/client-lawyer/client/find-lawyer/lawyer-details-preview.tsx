import React from "react";
import { LawyerDetails } from "@/types/client/find-lawyer";
import DefinitionCard from "./definition-card";
import Details from "./details";

export default function LawyerDetailsPreview({
  lawyer,
}: {
  lawyer: LawyerDetails;
}) {
  console.log(lawyer);
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <DefinitionCard lawyer={lawyer} />

      <div className="sm:col-span-2">
        <Details />
      </div>
    </div>
  );
}
