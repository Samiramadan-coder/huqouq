"use client";

import { cn } from "@/lib/utils";
import { useLawyerBrowseCasesFilters } from "@/providers/lawyer-browse-cases-filters";

// Dims the list while a filter, sort or search change is being fetched
export default function CasesPendingRegion({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPending } = useLawyerBrowseCasesFilters();

  return (
    <div
      aria-busy={isPending}
      className={cn(
        "space-y-3 transition-opacity duration-200 motion-reduce:transition-none",
        isPending && "opacity-60",
      )}
    >
      {children}
    </div>
  );
}
