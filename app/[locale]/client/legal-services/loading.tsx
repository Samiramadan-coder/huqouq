import {
  TitleSkeleton,
  LegalServicesListSkeleton,
} from "@/components/client-lawyer/client/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingRegion } from "@/components/client-lawyer/reusable/skeletons";

export default function Loading() {
  return (
    <LoadingRegion className="py-10 container max-w-7xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <TitleSkeleton hint />
        <Skeleton className="ms-auto h-10 w-36 rounded-sm" />
      </div>

      <LegalServicesListSkeleton />
    </LoadingRegion>
  );
}
