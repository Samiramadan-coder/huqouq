import AutoRenew from "./auto-renew";
import ChangePlan from "./change-plan";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CancelMembership } from "./cancel-membership";
import { CircleCheck, CircleSlash, ShieldCheck } from "lucide-react";
import { EmergencyMemberShip } from "@/types/lawyer/emergency-membership";

type Props = { membership: EmergencyMemberShip };

export default function MembershipStatus({ membership }: Props) {
  switch (membership.status) {
    case "active":
      return <ActiveStatus membership={membership} />;
    case "cancelled":
      return <CancelledStatus membership={membership} />;
    default:
      return <NoSubscriptionStatus />;
  }
}

function getPlanLabel(membership: EmergencyMemberShip) {
  return membership.plans.find((p) => p.id === membership.plan)?.label ?? "";
}

function NoSubscriptionStatus() {
  const t = useTranslations("Lawyer.EmergencyMembership");

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

function ActiveStatus({ membership }: Props) {
  const t = useTranslations("Lawyer.EmergencyMembership");
  const format = useFormatters();
  const planLabel = getPlanLabel(membership);

  const notChoosedPlans = membership.plans.filter(
    (p) => p.id !== membership.plan,
  );

  return (
    <div className="bg-white border rounded-sm p-5 border-green-200">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
          <CircleCheck className="size-4.5" aria-hidden="true" />
        </span>

        <div className="flex-1">
          <p className="ltr:font-lora font-semibold text-green-700">
            {t("activeTitle")}
          </p>
          <p className="text-sm text-primary/45">
            {t("planLabel", { plan: planLabel })}
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

function CancelledStatus({ membership }: Props) {
  const t = useTranslations("Lawyer.EmergencyMembership");
  const format = useFormatters();
  const planLabel = getPlanLabel(membership);

  return (
    <div className="bg-white border rounded-sm flex items-center gap-4 p-5 border-amber-200">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
        <CircleSlash className="size-4.5" aria-hidden="true" />
      </span>

      <div className="flex-1">
        <p className="ltr:font-lora font-semibold text-amber-700">
          {t("Cancelled.title")}
        </p>
        <p className="text-sm text-primary/45">
          {planLabel && t("planLabel", { plan: planLabel })}
          {planLabel && membership.renews_at && " · "}
          {membership.renews_at &&
            t("Cancelled.activeUntil", {
              date: format.date(membership.renews_at),
            })}
        </p>
        <p className="mt-1 text-xs text-primary/45">{t("Cancelled.hint")}</p>
      </div>
    </div>
  );
}
