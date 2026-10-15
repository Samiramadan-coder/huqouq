import {
  CardSkeleton,
  LoadingRegion,
} from "@/components/client-lawyer/reusable/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { TitleSkeleton } from "@/components/client-lawyer/client/skeletons";

export default function Loading() {
  return (
    <LoadingRegion className="space-y-6 container max-w-3xl py-10">
      <TitleSkeleton hint />

      <div className="bg-white border border-secondary rounded-sm p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-23 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-secondary flex">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      <CardSkeleton lines={5} className="rounded-sm p-6" />
      <CardSkeleton lines={3} className="rounded-sm" />
    </LoadingRegion>
  );
}
