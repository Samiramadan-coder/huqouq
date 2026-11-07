import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Emergency } from "@/types/lawyer/emergency-history";
import { CircleAlert, CircleCheck, CircleX, Clock } from "lucide-react";

// Styled by this lawyer's result on the request, not the request status
const resultStyles: Record<
  Emergency["my_result"],
  { className: string; Icon: typeof CircleCheck }
> = {
  accepted: {
    className: "border-green-200 bg-green-50 text-green-700",
    Icon: CircleCheck,
  },
  declined: {
    className: "border-secondary bg-secondary/40 text-primary/50",
    Icon: CircleX,
  },
  missed: {
    className: "border-amber-200 bg-amber-50 text-amber-700",
    Icon: CircleAlert,
  },
  pending: {
    className: "border-secondary bg-secondary/40 text-primary/60",
    Icon: Clock,
  },
};

export function StatusBadge({ emergency }: { emergency: Emergency }) {
  const t = useTranslations("Lawyer.EmergencyHistory.Results");
  const style = resultStyles[emergency.my_result] ?? resultStyles.pending;
  const Icon = style.Icon;

  // Accepted requests show the call state (In call / Completed / Dropped)
  const label =
    emergency.my_result === "accepted"
      ? emergency.status_label
      : t(emergency.my_result);

  return (
    <Badge
      variant="outline"
      className={cn("rounded-sm px-2.5 py-3 font-medium", style.className)}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </Badge>
  );
}
