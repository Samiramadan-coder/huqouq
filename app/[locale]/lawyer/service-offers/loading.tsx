import {
  TabsSkeleton,
  TableSkeleton,
  LoadingRegion,
} from "@/components/client-lawyer/reusable/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <LoadingRegion className="space-y-6">
      <Skeleton className="h-4 w-72 max-w-full mt-1" />
      <TabsSkeleton count={4} />
      <TableSkeleton columns={7} />
    </LoadingRegion>
  );
}
