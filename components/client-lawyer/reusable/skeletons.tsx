import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

// Wraps a skeleton layout so assistive tech announces a single loading state
export function LoadingRegion({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("Common");

  return (
    <div role="status" aria-label={t("Loading")} className={className}>
      {children}
    </div>
  );
}

// White bordered block with a small heading and a few text lines
export function CardSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white border border-secondary rounded-xs p-5 space-y-3",
        className,
      )}
    >
      <Skeleton className="h-3 w-24" />
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn("h-4", index === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

// Mirrors the case card used in browse cases and hire cases
export function CaseCardSkeleton() {
  return (
    <div className="bg-white border border-secondary rounded-xs p-4">
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-6 w-24 rounded-xs" />
        <Skeleton className="h-6 w-16 rounded-xs" />
      </div>
      <Skeleton className="h-5 w-1/2 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-4/5 mb-4" />
      <div className="flex items-center flex-wrap gap-4 mb-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="border-t border-secondary pt-4 flex items-center justify-between gap-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-10 w-28 rounded-xs" />
      </div>
    </div>
  );
}

// Row of status filter tabs
export function TabsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-2 overflow-hidden">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-9 w-24 shrink-0 rounded-sm" />
      ))}
    </div>
  );
}

// Mirrors the reusable data table
export function TableSkeleton({
  columns,
  rows = 5,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <div className="border border-secondary overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-secondary">
            {Array.from({ length: columns }, (_, index) => (
              <TableHead key={index} className="px-5 py-3">
                <Skeleton className="h-3 w-16" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, row) => (
            <TableRow key={row} className="border-secondary">
              {Array.from({ length: columns }, (_, column) => (
                <TableCell key={column} className="px-5 py-3">
                  <Skeleton className="h-4 w-full max-w-28" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Title, search box, filters sidebar and a list, as in browse cases and browse services
export function BrowseListSkeleton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoadingRegion className="space-y-6 px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="ms-auto h-11 w-full max-w-xs rounded-sm" />
      </div>

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
            <Skeleton className="h-4 w-40" />
            <Skeleton className="ms-auto h-10 w-full max-w-48 rounded-xs" />
          </div>

          {children}
        </div>
      </div>
    </LoadingRegion>
  );
}

// Main column of content blocks beside a narrower sidebar, as in the details pages
export function DetailsSkeleton({
  asideClassName,
  className,
}: {
  asideClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col lg:flex-row gap-6", className)}>
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <CardSkeleton lines={2} />
        <CardSkeleton lines={4} />
        <CardSkeleton lines={3} />
      </div>

      <div className={cn("w-full shrink-0 flex flex-col gap-4", asideClassName)}>
        <CardSkeleton lines={5} />
        <CardSkeleton lines={2} />
      </div>
    </div>
  );
}
