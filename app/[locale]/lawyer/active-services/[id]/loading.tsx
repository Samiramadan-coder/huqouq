import {
  LoadingRegion,
  DetailsSkeleton,
} from "@/components/client-lawyer/reusable/skeletons";

export default function Loading() {
  return (
    <LoadingRegion>
      <DetailsSkeleton asideClassName="lg:w-70" />
    </LoadingRegion>
  );
}
