import {
  CaseCardSkeleton,
  BrowseListSkeleton,
} from "@/components/client-lawyer/reusable/skeletons";

export default function Loading() {
  return (
    <BrowseListSkeleton>
      {Array.from({ length: 3 }, (_, index) => (
        <CaseCardSkeleton key={index} />
      ))}
    </BrowseListSkeleton>
  );
}
