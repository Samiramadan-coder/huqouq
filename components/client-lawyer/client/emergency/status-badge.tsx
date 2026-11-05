import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Emergency } from "@/types/client/emergency";
import { CircleCheck, CircleX, Flag, PhoneMissed } from "lucide-react";
import { useTranslations } from "next-intl";

const statusStyles: Record<
  string,
  { className: string; Icon: typeof CircleCheck }
> = {
  completed: {
    className: "border-green-200 bg-green-50 text-green-700",
    Icon: CircleCheck,
  },
  no_lawyer: {
    className: "border-secondary bg-secondary/40 text-primary/50",
    Icon: CircleX,
  },
  cancelled: {
    className: "border-secondary bg-secondary/40 text-primary/50",
    Icon: PhoneMissed,
  },
  under_review: {
    className: "border-amber-200 bg-amber-50 text-amber-700",
    Icon: Flag,
  },
};

export function StatusBadge({ emergency }: { emergency: Emergency }) {
  const t = useTranslations("Client.EmergencyHistory");
  const style = statusStyles[emergency.status];
  const Icon = style?.Icon ?? CircleCheck;

  return (
    <div className="flex flex-col items-start gap-1.5">
      <Badge
        variant="outline"
        className={cn(
          "rounded-sm px-2.5 py-3 font-medium",
          style?.className ?? "border-secondary bg-secondary/40 text-primary",
        )}
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
