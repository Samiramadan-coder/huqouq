import { FavoritesSkeleton } from "@/components/client-lawyer/client/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingRegion } from "@/components/client-lawyer/reusable/skeletons";

export default function Loading() {
  return (
    <LoadingRegion className="p-4 sm:p-6 space-y-6">
      <Skeleton className="h-8 w-40" />

      <FavoritesSkeleton />
    </LoadingRegion>
  );
}
