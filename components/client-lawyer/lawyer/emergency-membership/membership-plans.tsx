import { PlanCard } from "./plan-card";
import { Sparkles } from "lucide-react";
import BenifitsRules from "./benifits-rules";
import { getTranslations } from "next-intl/server";
import MembershipStatus from "./membership-status";
import { EmergencyMemberShip } from "@/types/lawyer/emergency-membership";

export default async function MembershipPlans({
  membership,
}: {
  membership: EmergencyMemberShip;
}) {
  const t = await getTranslations("Lawyer.EmergencyMembership");
  const { plans } = membership;
  const isFree = membership.is_launch_free || membership.free_during_launch;

  return (
    <div className="space-y-6">
      <MembershipStatus membership={membership} />

      {isFree && (
        <div className="flex items-center gap-3 rounded-sm border border-accent/30 bg-accent/10 px-5 py-4 text-sm text-primary/80">
          <Sparkles
            className="size-4 shrink-0 text-accent"
            aria-hidden="true"
          />
          {t("launchBanner")}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isFree={isFree}
            isCurrent={false}
          />
        ))}
      </div>

      <BenifitsRules />
    </div>
  );
}
