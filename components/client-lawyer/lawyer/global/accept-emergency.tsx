"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Emergency } from "@/types/lawyer/emergency-history";
import { acceptEmergency } from "@/lib/lawyer/emergency-requests";

export default function AcceptEmergency({
  emergencyId,
  disabled,
  onDone,
}: {
  emergencyId: Emergency["id"];
  disabled?: boolean;
  onDone: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("Lawyer.EmergencyRequest");
  const [pending, startTransition] = useTransition();

  function onAccept() {
    startTransition(async () => {
      const result = await acceptEmergency(emergencyId);

      if (!result.success) {
        toast.error(result.message ?? t("acceptFailed"));
        return;
      }

      toast.success(result.message ?? t("acceptSuccess"));
      onDone();
      router.refresh();
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
