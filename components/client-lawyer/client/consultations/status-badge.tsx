import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Colors per consultation status; unknown statuses fall back to neutral
const statusClassName: Record<string, string> = {
  upcoming: "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-green-200 bg-green-50 text-green-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
  needs_new_time: "border-amber-200 bg-amber-50 text-amber-700",
};

export default function StatusBadge({
  status,
  label,
  className,
}: {
  status: string;
  label: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-sm px-2.5 py-3 font-normal",
        statusClassName[status] ??
          "border-secondary bg-secondary/40 text-primary",
        className,
      )}
    >
      <span
        className="size-1.5 shrink-0 rounded-full bg-current"
        aria-hidden="true"
      />
      {label}
    </Badge>
  );
}
