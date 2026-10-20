import {
  CardSkeleton,
  TabsSkeleton,
  TableSkeleton,
} from "@/components/client-lawyer/reusable/skeletons";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Page title with the hint line underneath
export function TitleSkeleton({ hint = false }: { hint?: boolean }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-44" />
      {hint && <Skeleton className="h-4 w-64 max-w-full" />}
    </div>
  );
}

// "Back to …" link above details and form pages
export function BackBtnSkeleton() {
  return <Skeleton className="h-4 w-36" />;
}

// Mirrors a single lawyer card
export function LawyerCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-secondary bg-white">
      <Skeleton className="aspect-410/545 w-full rounded-none" />
      <div className="space-y-4 px-5 py-5">
        <div className="space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-6.5 w-16 rounded-full" />
          <Skeleton className="h-6.5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

// Mirrors the favorites lawyer cards grid
export function FavoritesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
        <LawyerCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Mirrors the find lawyers filters sidebar and lawyer cards grid
export function LawyersResultsSkeleton() {
  return (
    <div className="flex items-start gap-5">
      <div className="w-60 shrink-0 hidden lg:block">
        <div className="bg-white border border-secondary px-4 py-3 space-y-4">
          <Skeleton className="h-4 w-20" />
          {Array.from({ length: 3 }, (_, group) => (
            <div key={group} className="space-y-3">
              <Skeleton className="h-3 w-24" />
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded-xs" />
                  <Skeleton className="h-3 w-28" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="ms-auto h-10 w-full max-w-48 rounded-xs" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <LawyerCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Mirrors the lawyer profile: definition card beside the about/reviews content
export function LawyerDetailsSkeleton() {
  return (
    <div className="grid items-start grid-cols-1 sm:grid-cols-3 gap-8">
      <div className="rounded-md border border-secondary bg-white px-7 py-8 flex flex-col items-center">
        <Skeleton className="size-32 rounded-full" />
        <Skeleton className="mt-5 h-6 w-40" />
        <Skeleton className="mt-2 h-3 w-28" />
        <Skeleton className="mt-6 h-4 w-32" />
        <Skeleton className="mt-3 h-3 w-40" />
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-24 rounded" />
        </div>
        <div className="mt-6 w-full space-y-2.5 border-t border-secondary pt-6">
          <Skeleton className="h-11 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
        </div>
      </div>

      <div className="sm:col-span-2 min-w-0 flex flex-col gap-5">
        <CardSkeleton lines={4} />
        <CardSkeleton lines={3} />
        <CardSkeleton lines={5} />
      </div>
    </div>
  );
}

// Mirrors the cases tabs, "add new" button and cases table
export function CasesListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <TabsSkeleton count={5} />
        <Skeleton className="ms-auto h-10 w-32 rounded-sm" />
      </div>

      <TableSkeleton columns={6} />
    </div>
  );
}

// Mirrors the case details: title, badges and the timeline/info cards
export function CaseDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-9 w-20 rounded-sm" />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24 rounded-xs" />
          <Skeleton className="h-6 w-16 rounded-xs" />
        </div>
      </div>

      <CardSkeleton lines={5} />
      <CardSkeleton lines={4} />
      <CardSkeleton lines={3} />
    </div>
  );
}

// Mirrors the legal services tabs and request rows
export function LegalServicesListSkeleton() {
  return (
    <div className="space-y-4">
      <TabsSkeleton count={5} />

      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="bg-white border border-secondary rounded-sm flex flex-wrap items-center gap-4 px-5 py-4"
        >
          <div className="flex min-w-0 flex-[1_1_320px] items-center gap-4">
            <Skeleton className="size-9 shrink-0 rounded-sm" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Skeleton className="h-6 w-20 rounded-xs" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Mirrors the legal service details: offers/timeline beside the status card
export function LegalServiceDetailsSkeleton() {
  return (
    <div className="grid items-start grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div className="md:col-span-2 min-w-0 space-y-4">
        <CardSkeleton lines={4} />
        <CardSkeleton lines={4} />
        <CardSkeleton lines={3} />
      </div>

      <div className="space-y-4">
        <CardSkeleton lines={5} />
      </div>
    </div>
  );
}

// Mirrors the create/edit forms: title, hint and a column of fields
export function FormSkeleton({
  fields = 6,
  backBtn = false,
}: {
  fields?: number;
  backBtn?: boolean;
}) {
  return (
    <>
      {backBtn && <BackBtnSkeleton />}
      <TitleSkeleton hint />

      <div className="space-y-4">
        {Array.from({ length: fields }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton
              className={cn(
                "w-full rounded-none",
                index === 3 ? "h-28" : "h-11",
              )}
            />
          </div>
        ))}

        <Skeleton className="h-11 w-full rounded-sm" />
      </div>
    </>
  );
}

// Mirrors the consultations status tabs and consultation rows
export function ConsultationsListSkeleton() {
  return (
    <div className="space-y-4">
      <TabsSkeleton count={5} />

      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="bg-white rounded-sm border border-secondary p-5 flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <Skeleton className="size-11 shrink-0 rounded-full" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          <Skeleton className="h-9 w-20 rounded-sm" />
        </div>
      ))}
    </div>
  );
}
