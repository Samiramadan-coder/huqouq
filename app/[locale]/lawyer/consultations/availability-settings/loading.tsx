import { Skeleton } from "@/components/ui/skeleton";
import { LoadingRegion } from "@/components/client-lawyer/reusable/skeletons";

// Mirrors a section card: bordered block with a small header strip
function SectionSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-secondary">
      <div className="px-5 py-4 border-b border-secondary">
        <Skeleton className="h-3 w-40" />
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

function FieldSkeleton({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Skeleton className="h-3 w-28 mb-2" />
      <Skeleton className="h-11 w-full rounded-none" />
    </div>
  );
}

export default function Loading() {
  return (
    <LoadingRegion className="space-y-6">
      <SectionSkeleton>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2 space-y-3">
            <Skeleton className="h-3 w-36" />
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton className="sm:col-span-2" />
        </div>
      </SectionSkeleton>

      <SectionSkeleton>
        <div className="divide-y divide-secondary">
          {Array.from({ length: 7 }, (_, index) => (
            <div key={index} className="flex items-center gap-2 py-3">
              <Skeleton className="h-5 w-9 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="ms-auto size-4" />
            </div>
          ))}
        </div>
      </SectionSkeleton>

      <SectionSkeleton>
        <Skeleton className="h-3 w-3/4 mb-3" />
        <div className="flex gap-2">
          <Skeleton className="h-11 flex-1 rounded-sm" />
          <Skeleton className="h-11 w-16 rounded-sm" />
        </div>
      </SectionSkeleton>

      <Skeleton className="h-11 w-40 rounded-sm" />
    </LoadingRegion>
  );
}
