import { FormSkeleton } from "@/components/client-lawyer/client/skeletons";
import { LoadingRegion } from "@/components/client-lawyer/reusable/skeletons";

export default function Loading() {
  return (
    <LoadingRegion className="container max-w-3xl space-y-6 py-10">
      <FormSkeleton fields={8} />
    </LoadingRegion>
  );
}
