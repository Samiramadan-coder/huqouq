import { Skeleton } from "@/components/ui/skeleton";

function SectionHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-28" />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="container max-w-7xl mx-auto space-y-8 py-10">
      {/* Info */}
      <div className="space-y-6">
        <Skeleton className="h-6 w-56" />
        <div className="flex items-center gap-5 rounded-xs bg-primary/10 px-6 py-5">
          <Skeleton className="size-16.5 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-xs" />
              <Skeleton className="h-5 w-24 rounded-xs" />
            </div>
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
        <div className="flex items-center gap-5 rounded-xs border border-secondary bg-white px-5 py-5">
          <Skeleton className="size-13.5 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-72 max-w-full" />
          </div>
        </div>
      </div>

      {/* Legal services */}
      <div className="space-y-3">
        <SectionHeaderSkeleton />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="rounded-sm border border-secondary bg-white p-5 space-y-2"
            >
              <Skeleton className="size-9 rounded-sm mb-3" />
              <Skeleton className="h-7 w-10" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-28 mt-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent cases */}
      <div className="space-y-3">
        <SectionHeaderSkeleton />
        <div className="rounded-sm border border-secondary bg-white">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="flex items-center gap-6 px-5 py-4 border-b border-secondary last:border-b-0"
            >
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-xs" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Consultations */}
      <div className="space-y-3">
        <SectionHeaderSkeleton />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }, (_, index) => (
            <div
              key={index}
              className="rounded-sm border border-secondary bg-white p-5 flex items-start gap-4"
            >
              <Skeleton className="size-11 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <Skeleton className="h-8 w-20 rounded-sm" />
            </div>
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-sm" />
      </div>
    </div>
  );
}
