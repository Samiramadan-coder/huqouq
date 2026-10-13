import {
  TabsSkeleton,
  LoadingRegion,
} from "@/components/client-lawyer/reusable/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <LoadingRegion className="space-y-4">
      <div className="bg-white border border-secondary rounded-sm p-4 flex flex-wrap gap-x-6 gap-y-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      <TabsSkeleton count={6} />

      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="bg-white border border-secondary rounded-sm p-4"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <Skeleton className="h-6 w-24 rounded-xs" />
            <Skeleton className="h-6 w-20 rounded-xs" />
          </div>
          <Skeleton className="h-5 w-1/2 mb-2" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-3 w-32 mt-2" />
        </div>
      ))}
    </LoadingRegion>
  );
}
