import { Skeleton } from "@/components/ui/skeleton";
import { LoadingRegion } from "@/components/client-lawyer/reusable/skeletons";

// Mirrors the payout details card: header strip, two fields and the edit button
export default function Loading() {
  return (
    <LoadingRegion>
      <div className="bg-white border border-secondary">
        <div className="px-5 py-4 border-b border-secondary">
          <Skeleton className="h-3 w-32" />
        </div>

        <div className="px-5 py-5 flex flex-col-reverse sm:flex-row sm:items-start gap-4 sm:gap-6">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 2 }, (_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-4 w-48 max-w-full" />
              </div>
            ))}
          </div>

          <Skeleton className="h-9 w-20 rounded-sm self-end sm:self-auto" />
        </div>
      </div>
    </LoadingRegion>
  );
}
