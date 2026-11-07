"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useId, useState, useTransition } from "react";
import { Emergency } from "@/types/lawyer/emergency-history";
import { declineEmergency } from "@/lib/lawyer/emergency-requests";

// The decline step: asks for a reason, then declines the request
export default function DeclineEmergency({
  emergencyId,
  disabled,
  onBack,
  onDone,
}: {
  emergencyId: Emergency["id"];
  disabled?: boolean;
  onBack: () => void;
  onDone: () => void;
}) {
  const router = useRouter();
  const reasonId = useId();
  const t = useTranslations("Lawyer.EmergencyRequest.Decline");
  const [pending, startTransition] = useTransition();
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);

  function onDecline() {
    const trimmed = reason.trim();

    if (!trimmed) {
      setReasonError(t("reasonRequired"));
      return;
    }

    startTransition(async () => {
      const result = await declineEmergency(emergencyId, trimmed);

      if (!result.success) {
        toast.error(result.message ?? t("failed"));
        return;
      }

      toast.success(result.message ?? t("success"));
      onDone();
      router.refresh();
    });
  }

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={reasonId} className="text-xs text-primary/60">
          {t("reasonLabel")}
        </Label>
        <Textarea
          id={reasonId}
          value={reason}
          maxLength={500}
          disabled={pending || disabled}
          aria-invalid={!!reasonError}
          placeholder={t("reasonPlaceholder")}
          className="border-secondary"
          onChange={(event) => {
            setReason(event.target.value);
            setReasonError(null);
          }}
        />
        {reasonError && (
          <p className="text-xs text-destructive">{reasonError}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={onBack}
          className="h-11 rounded-sm border-secondary font-normal text-primary/60"
        >
          {t("back")}
        </Button>
        <Button
          type="button"
          disabled={pending || disabled}
          onClick={onDecline}
          className="h-11 rounded-sm bg-destructive text-white hover:bg-destructive/90"
        >
          {pending && <Spinner />}
          {t("submit")}
        </Button>
      </div>
    </>
  );
}
