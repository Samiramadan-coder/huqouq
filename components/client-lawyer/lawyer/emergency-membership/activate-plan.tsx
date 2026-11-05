"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function ActivatePlan({
  isCurrent,
  isFree,
}: {
  isCurrent: boolean;
  isFree: boolean;
}) {
  const t = useTranslations("Lawyer.EmergencyMembership");

  return (
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
  );
}
