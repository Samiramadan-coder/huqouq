import {
  TabsSkeleton,
  TableSkeleton,
  LoadingRegion,
} from "@/components/client-lawyer/reusable/skeletons";

export default function Loading() {
  return (
    <LoadingRegion className="space-y-6">
      <TabsSkeleton count={4} />
      <TableSkeleton columns={6} />
    </LoadingRegion>
  );
}
