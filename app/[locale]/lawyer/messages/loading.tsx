import { Skeleton } from "@/components/ui/skeleton";
import { LoadingRegion } from "@/components/client-lawyer/reusable/skeletons";

export default function Loading() {
  return (
    <LoadingRegion className="flex h-[calc(100vh-56px)]">
      <aside className="w-75 h-full bg-white border-e border-secondary">
        <div className="border-b border-secondary px-4 pt-5 pb-3">
          <Skeleton className="h-6 w-28 mb-3" />
          <Skeleton className="h-9 w-full rounded-sm" />
        </div>

        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="size-11 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </aside>

      <div className="flex-1 h-full flex flex-col">
        <div className="flex items-center gap-3 border-b border-secondary bg-white px-5 py-3.5">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        <div className="flex-1 px-5 py-4 flex flex-col gap-5">
          <Skeleton className="h-12 w-1/2 max-w-sm" />
          <Skeleton className="h-12 w-1/3 max-w-xs self-end" />
          <Skeleton className="h-12 w-2/5 max-w-sm" />
        </div>
      </div>
    </LoadingRegion>
  );
}
