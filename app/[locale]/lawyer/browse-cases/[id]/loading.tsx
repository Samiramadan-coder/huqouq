import {
  LoadingRegion,
  DetailsSkeleton,
} from "@/components/client-lawyer/reusable/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <LoadingRegion className="space-y-4">
      <div>
        <Skeleton className="h-8 w-2/3" />
        <div className="flex flex-wrap gap-2 mb-3 mt-2">
          <Skeleton className="h-6 w-24 rounded-xs" />
          <Skeleton className="h-6 w-16 rounded-xs" />
        </div>
      </div>

      <DetailsSkeleton className="gap-5" asideClassName="lg:w-75" />
    </LoadingRegion>
  );
}
