import { Skeleton } from "@/components/ui/skeleton";
import { LoadingRegion } from "@/components/client-lawyer/reusable/skeletons";
import { TitleSkeleton } from "@/components/client-lawyer/client/skeletons";

// Mirrors NotificationsPage: title, then date groups of notification rows
export default function NotificationsSkeleton() {
  return (
    <LoadingRegion className="container py-10 max-w-4xl space-y-6">
      <TitleSkeleton hint />

      {[3, 2].map((rows, group) => (
        <div key={group} className="space-y-3">
          <Skeleton className="h-3 w-20" />

          <div className="bg-white border border-secondary rounded-md divide-y divide-secondary">
            {Array.from({ length: rows }, (_, index) => (
              <div key={index} className="flex items-start gap-4 px-4 py-4">
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48 max-w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </LoadingRegion>
  );
}
