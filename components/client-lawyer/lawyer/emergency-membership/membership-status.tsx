import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { CircleCheck, ShieldCheck } from "lucide-react";
import { EmergencyMemberShip } from "@/types/client/emergency-membership";

export default function MembershipStatus({
  membership,
}: {
  membership: EmergencyMemberShip;
}) {
  const t = useTranslations("Lawyer.EmergencyMembership");
  const format = useFormatters();
  const isActive = membership.status === "active" && membership.plan;

  if (!isActive) {
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

  return (
    <div className="bg-white border rounded-sm flex flex-col sm:flex-row sm:items-center gap-4 p-5 border-green-200">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
        <CircleCheck className="size-4.5" aria-hidden="true" />
      </span>

      <div className="flex-1">
        <p className="ltr:font-lora font-semibold text-green-700">
          {t("activeTitle")}
        </p>
        <p className="text-sm text-primary/45">
          {t("planLabel", { plan: membership.plan!.label })}
          {membership.renews_at &&
            ` · ${t("renews", { date: format.date(membership.renews_at) })}`}
        </p>
      </div>

      <CancelMembership />
    </div>
  );
}

function CancelMembership() {
  const t = useTranslations("Lawyer.EmergencyMembership");

  return (
    <Button
      type="button"
      variant="outline"
      className="rounded-sm border-destructive/30 bg-transparent text-xs font-normal text-destructive hover:bg-destructive/5 hover:text-destructive"
    >
      {t("cancelMembership")}
    </Button>
  );
}
