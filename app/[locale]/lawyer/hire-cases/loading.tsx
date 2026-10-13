import {
  LoadingRegion,
  CaseCardSkeleton,
} from "@/components/client-lawyer/reusable/skeletons";

export default function Loading() {
  return (
    <LoadingRegion className="space-y-4">
      {Array.from({ length: 3 }, (_, index) => (
        <CaseCardSkeleton key={index} />
      ))}
    </LoadingRegion>
  );
}
