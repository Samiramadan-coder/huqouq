import { Skeleton } from "@/components/ui/skeleton";
import { LoadingRegion } from "@/components/client-lawyer/reusable/skeletons";

export default function Loading() {
  return (
    <LoadingRegion className="space-y-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="bg-white border border-secondary rounded-xs px-6 py-4 flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-20 rounded-xs" />
              <Skeleton className="h-6 w-16 rounded-xs" />
              <Skeleton className="h-6 w-24 rounded-xs" />
            </div>
            <Skeleton className="mt-3 h-6 w-1/2" />
            <div className="mt-3 flex flex-wrap gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-center gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </LoadingRegion>
  );
}
