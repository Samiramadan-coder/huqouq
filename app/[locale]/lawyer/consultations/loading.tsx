import {
  TabsSkeleton,
  LoadingRegion,
} from "@/components/client-lawyer/reusable/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <LoadingRegion>
      <TabsSkeleton count={5} />

      <div className="mt-4 space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="bg-white rounded-sm border border-secondary px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex flex-1 min-w-0 items-center gap-4">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <div className="flex flex-wrap items-center gap-4">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:ms-auto">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-28 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </LoadingRegion>
  );
}
