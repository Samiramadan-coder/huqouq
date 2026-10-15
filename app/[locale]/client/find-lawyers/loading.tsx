import {
  TitleSkeleton,
  LawyersResultsSkeleton,
} from "@/components/client-lawyer/client/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingRegion } from "@/components/client-lawyer/reusable/skeletons";

export default function Loading() {
  return (
    <LoadingRegion className="space-y-6 px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <TitleSkeleton hint />
        <Skeleton className="ms-auto h-11 w-full max-w-xs rounded-sm" />
      </div>

      <LawyersResultsSkeleton />
    </LoadingRegion>
  );
}
