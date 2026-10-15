import { ConsultationsListSkeleton } from "@/components/client-lawyer/client/skeletons";
import { LoadingRegion } from "@/components/client-lawyer/reusable/skeletons";

export default function Loading() {
  return (
    <LoadingRegion>
      <ConsultationsListSkeleton />
    </LoadingRegion>
  );
}
