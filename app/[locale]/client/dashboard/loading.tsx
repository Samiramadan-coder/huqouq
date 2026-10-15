import {
  CardSkeleton,
  LoadingRegion,
  TableSkeleton,
} from "@/components/client-lawyer/reusable/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <LoadingRegion className="container max-w-7xl space-y-6 py-10">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="p-4 bg-white border border-secondary flex items-center gap-4"
          >
            <Skeleton className="size-9 rounded-none" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-10" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>

      {Array.from({ length: 2 }, (_, section) => (
        <div key={section}>
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CardSkeleton lines={2} className="rounded-none" />
            <CardSkeleton lines={2} className="rounded-none" />
          </div>
        </div>
      ))}

      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-20" />
        </div>
        <TableSkeleton columns={6} />
      </div>
    </LoadingRegion>
  );
}
