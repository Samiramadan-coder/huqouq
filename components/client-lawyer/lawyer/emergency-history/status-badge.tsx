import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { CircleAlert, CircleX, Clock } from "lucide-react";
import { Emergency } from "@/types/lawyer/emergency-history";
import {
  BadgeStyle,
  neutralBadgeStyle,
  emergencyStatusStyles,
} from "../../reusable/emergency-status-styles";

// Requests this lawyer didn't take: styled by the lawyer's own result
const resultStyles: Record<
  Exclude<Emergency["my_result"], "accepted">,
  BadgeStyle
> = {
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
  const accepted = emergency.my_result === "accepted";

  // Accepted requests show what happened to the call (In call / Converted /
  // Dropped / Client didn't answer...), styled by that status
  const style = accepted
    ? (emergencyStatusStyles[emergency.status] ?? neutralBadgeStyle)
    : (resultStyles[emergency.my_result as keyof typeof resultStyles] ??
      neutralBadgeStyle);
  const label = accepted ? emergency.status_label : t(emergency.my_result);
  const Icon = style.Icon;

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
