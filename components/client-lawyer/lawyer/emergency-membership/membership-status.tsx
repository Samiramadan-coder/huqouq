import AutoRenew from "./auto-renew";
import ChangePlan from "./change-plan";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CancelMembership } from "./cancel-membership";
import { CircleCheck, ShieldCheck } from "lucide-react";
import { EmergencyMemberShip } from "@/types/lawyer/emergency-membership";

export default function MembershipStatus({
  membership,
}: {
  membership: EmergencyMemberShip;
}) {
  const t = useTranslations("Lawyer.EmergencyMembership");
  const format = useFormatters();

  const noSubscriptionFounded =
    membership.status === "none" || membership.status === "expired";

  const isActive = membership.status === "active";

  const isCancelled = membership.status === "cancelled";

  if (noSubscriptionFounded) {
    return (
      <div className="bg-white border border-secondary rounded-sm flex items-center gap-4 p-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/50 text-primary/45">
          <ShieldCheck className="size-4.5" aria-hidden="true" />
        </span>
        <div>
          <p className="ltr:font-lora font-semibold text-primary">
            {t("notMember")}
          </p>
          <p className="text-sm text-primary/45">{t("notMemberHint")}</p>
        </div>
      </div>
    );
  }

  const activePlanTitle =
    membership.plans.find((p) => p.id === membership.plan)?.label || "";

  const notChoosedPlans = membership.plans.filter(
    (p) => p.id !== membership.plan,
  );

  return (
    <div className="bg-white border rounded-sm p-5 border-green-200">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="flex size-9  items-center justify-center rounded-full bg-green-50 text-green-700">
          <CircleCheck className="size-4.5" aria-hidden="true" />
        </span>

        <div className="flex-1">
          <p className="ltr:font-lora font-semibold text-green-700">
            {t("activeTitle")}
          </p>
          <p className="text-sm text-primary/45">
            {t("planLabel", { plan: activePlanTitle })}
            {membership.renews_at &&
              ` · ${t("renews", { date: format.date(membership.renews_at) })}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="auto-renew" className="text-primary/60 text-xs">
            {t("AutoRenew.label")}
          </Label>

          <AutoRenew autoRenew={membership.auto_renew} />
        </div>
      </div>

      {membership.auto_renew && (
        <>
          <Separator className="my-4 bg-secondary" />
          <div className="flex items-center gap-4">
            <ChangePlan
              notChoosedPlans={notChoosedPlans}
              renewsAt={membership.renews_at}
            />
            <CancelMembership />
          </div>
        </>
      )}
    </div>
  );
}
