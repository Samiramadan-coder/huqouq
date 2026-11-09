"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Emergency } from "@/types/lawyer/emergency-history";
import { acceptEmergency } from "@/lib/lawyer/emergency-requests";

export default function AcceptEmergency({
  emergencyId,
  disabled,
  onAccepted,
  onTaken,
}: {
  emergencyId: Emergency["id"];
  disabled?: boolean;
  // Called once accepted; the parent then opens the call
  onAccepted: () => void;
  // Another lawyer accepted first (409); the parent closes the request
  onTaken: () => void;
}) {
  const t = useTranslations("Lawyer.EmergencyRequest");
  const [pending, startTransition] = useTransition();

  function onAccept() {
    startTransition(async () => {
      const result = await acceptEmergency(emergencyId);

      if (!result.success && result.code === "already_taken") {
        toast.error(t("alreadyTaken"));
        onTaken();
        return;
      }

      if (!result.success) {
        toast.error(result.message ?? t("acceptFailed"));
        return;
      }

      toast.success(result.message ?? t("acceptSuccess"));
      onAccepted();
    });
  }

  return (
    <Button
      type="button"
      disabled={pending || disabled}
      onClick={onAccept}
      className="h-11 rounded-sm"
    >
      {pending && <Spinner />}
      {t("accept")}
    </Button>
  );
}
