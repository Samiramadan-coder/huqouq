"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { useOptimistic, useTransition } from "react";
import { autoRenewPlan } from "@/lib/lawyer/emergency-membership";

export default function AutoRenew({ autoRenew }: { autoRenew: boolean }) {
  const t = useTranslations("Lawyer.EmergencyMembership.AutoRenew");
  const [pending, startTransition] = useTransition();
  // Flips instantly; falls back to the server value if the request fails
  const [checked, setChecked] = useOptimistic(autoRenew);

  function onCheckedChange(value: boolean) {
    startTransition(async () => {
      setChecked(value);
      const result = await autoRenewPlan(value);

      if (result.success) {
        toast.success(result.message ?? (value ? t("on") : t("off")));
        return;
      }

      toast.error(result.message ?? t("failed"));
    });
  }

  return (
    <Switch
      id="auto-renew"
      checked={checked}
      disabled={pending}
      aria-busy={pending}
      onCheckedChange={onCheckedChange}
    />
  );
}
