import {
  TitleSkeleton,
  CasesListSkeleton,
} from "@/components/client-lawyer/client/skeletons";
import { LoadingRegion } from "@/components/client-lawyer/reusable/skeletons";

export default function Loading() {
  return (
    <LoadingRegion className="space-y-6 container max-w-7xl py-10">
      <TitleSkeleton />
      <CasesListSkeleton />
    </LoadingRegion>
  );
}
