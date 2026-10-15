import {
  BackBtnSkeleton,
  LegalServiceDetailsSkeleton,
} from "@/components/client-lawyer/client/skeletons";
import { LoadingRegion } from "@/components/client-lawyer/reusable/skeletons";

export default function Loading() {
  return (
    <LoadingRegion className="container max-w-7xl py-10">
      <BackBtnSkeleton />
      <LegalServiceDetailsSkeleton />
    </LoadingRegion>
  );
}
