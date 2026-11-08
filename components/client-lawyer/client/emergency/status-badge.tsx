import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Emergency } from "@/types/client/emergency";
import { Flag } from "lucide-react";
import {
  neutralBadgeStyle,
  emergencyStatusStyles,
} from "../../reusable/emergency-status-styles";
import { useTranslations } from "next-intl";

export function StatusBadge({ emergency }: { emergency: Emergency }) {
  const t = useTranslations("Client.EmergencyHistory");
  const style = emergencyStatusStyles[emergency.status] ?? neutralBadgeStyle;
  const Icon = style.Icon;

  return (
    <div className="flex flex-col items-start gap-1.5">
      <Badge
        variant="outline"
        className={cn("rounded-sm px-2.5 py-3 font-medium", style.className)}
      >
        <Icon className="size-3.5" aria-hidden="true" />
        {emergency.status_label}
      </Badge>

      {emergency.report && (
        <Badge
          variant="outline"
          className="rounded-sm px-2 py-0.5 text-[11px] font-medium border-amber-200 bg-amber-50 text-amber-700"
        >
          <Flag className="size-3" aria-hidden="true" />
          {t("reportedUnderReview")}
        </Badge>
      )}
    </div>
  );
}
