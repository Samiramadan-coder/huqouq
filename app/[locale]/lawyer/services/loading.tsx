import { Skeleton } from "@/components/ui/skeleton";
import { BrowseListSkeleton } from "@/components/client-lawyer/reusable/skeletons";

export default function Loading() {
  return (
    <BrowseListSkeleton>
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="bg-white border border-secondary rounded-sm p-5 flex flex-wrap items-start gap-4"
        >
          <Skeleton className="size-10 rounded-sm shrink-0" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16 rounded-xs" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-3" />
            <div className="flex items-center gap-4 flex-wrap">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>

          <Skeleton className="h-8 w-20 rounded-sm" />
        </div>
      ))}
    </BrowseListSkeleton>
  );
}
