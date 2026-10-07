"use client";

import { cn } from "@/lib/utils";
import { useFindLawyerFilters } from "@/providers/find-lawyer-filters";

// Dims the results while a filter, sort or search change is being fetched
export default function LawyersPendingRegion({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPending } = useFindLawyerFilters();

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
