import { Button } from "@/components/ui/button";
import { useFormatters } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Plan } from "@/types/client/emergency-membership";
import { useTranslations } from "next-intl";

export function PlanCard({
  plan,
  isCurrent,
  isFree,
}: {
  plan: Plan;
  isCurrent: boolean;
  isFree: boolean;
}) {
  const t = useTranslations("Lawyer.EmergencyMembership");
  const format = useFormatters();

  return (
    <div className="bg-white border border-secondary rounded-sm relative flex flex-col p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary/45">
        {plan.label}
      </p>
      <p className="ltr:font-lora mt-1 text-3xl font-bold text-primary">
        {format.money(plan.price)}
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {isFree && (
          <span className="border-green-200 bg-green-50 text-green-700 inline-flex items-center rounded-sm border px-2 py-0.5 text-[11px] font-medium">
            {t("freeDuringLaunch")}
          </span>
        )}
      </div>

      {/* Design only for now; the activate action is wired up later */}
      <Button
        type="button"
        disabled={isCurrent}
        className={cn(
          "mt-5 h-10 w-full rounded-sm",
          isCurrent &&
            "bg-secondary/50 text-primary/40 disabled:opacity-100 hover:bg-secondary/50",
        )}
      >
        {isCurrent
          ? t("currentPlan")
          : isFree
            ? t("activateFree")
            : t("activate")}
      </Button>
    </div>
  );
}
