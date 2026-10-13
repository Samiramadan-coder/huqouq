import { Skeleton } from "@/components/ui/skeleton";
import { LoadingRegion } from "@/components/client-lawyer/reusable/skeletons";

export default function Loading() {
  return (
    <LoadingRegion className="mx-auto max-w-3xl">
      <div className="py-8">
        <Skeleton className="h-8 w-40 mb-7" />

        <div className="flex items-center gap-4">
          <Skeleton className="size-23 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="bg-white border border-primary/10 p-5 flex items-center justify-between gap-10"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="size-4 rounded-full" />
                <Skeleton className="h-4 w-44" />
              </div>
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </div>
    </LoadingRegion>
  );
}
