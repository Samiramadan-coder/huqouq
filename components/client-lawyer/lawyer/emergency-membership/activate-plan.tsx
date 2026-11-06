"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Plan } from "@/types/lawyer/emergency-membership";
import { activatePlan } from "@/lib/lawyer/emergency-membership";
import SubscribeButton from "./subscribe-btn";

export default function ActivatePlan({
  plan,
  isCurrent,
  isFree,
}: {
  plan: Plan;
  isCurrent: boolean;
  isFree: boolean;
}) {
  const t = useTranslations("Lawyer.EmergencyMembership");
  const [pending, startTransition] = useTransition();

  function onConfirmFree() {
    startTransition(async () => {
      const result = await activatePlan(plan.id);

      if (result.success) {
        toast.success(result.message ?? t("Activate.success"));
        return;
      }

      toast.error(result.message ?? t("Activate.failed"));
    });
  }

  if (isCurrent) {
    return (
      <Button
        type="button"
        disabled
        className="mt-5 h-10 w-full rounded-sm bg-secondary/50 text-primary/40 disabled:opacity-100 hover:bg-secondary/50"
      >
        {t("currentPlan")}
      </Button>
    );
  }

  if (isFree) {
    return (
      <Button
        type="button"
        className="mt-5 h-10 w-full rounded-sm"
        onClick={onConfirmFree}
        disabled={pending}
      >
        {t("activateFree")}
      </Button>
    );
  }

  return <SubscribeButton plan={plan} />;
}

// Subscribe  Button
