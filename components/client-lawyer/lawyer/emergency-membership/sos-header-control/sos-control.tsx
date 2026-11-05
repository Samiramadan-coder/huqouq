"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { GoLiveForm } from "./go-live-form";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { MembershipRequired } from "./membership-required";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EmergencyLive } from "@/types/lawyer/emergency-membership";
import { updateAvailability } from "@/lib/lawyer/emergency-membership";

export default function SosControl({
  emergencyLive,
}: {
  emergencyLive: EmergencyLive;
}) {
  const t = useTranslations("Lawyer.EmergencyLive");
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { is_live, can_go_live } = emergencyLive;

  // Going offline needs no options, so it happens straight from the pill
  function goOffline() {
    startTransition(async () => {
      const result = await updateAvailability({ is_live: false });

      if (result.success) {
        toast.success(result.message ?? t("offlineSuccess"));
      } else {
        toast.error(result.message ?? t("failed"));
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={is_live ? goOffline : () => setOpen(true)}
        disabled={pending}
        aria-pressed={is_live}
        className={cn(
          "flex h-9 items-center gap-2 rounded-sm border px-3 text-xs transition-colors disabled:opacity-60",
          is_live
            ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
            : "border-secondary bg-white text-primary/55 hover:bg-secondary/30",
        )}
      >
        {pending ? (
          <Spinner className="size-3" />
        ) : (
          <span
            className={cn(
              "size-1.5 rounded-full",
              is_live ? "bg-green-600 animate-pulse" : "bg-primary/25",
            )}
            aria-hidden="true"
          />
        )}
        <Zap className="size-3.5" aria-hidden="true" />
        {is_live ? t("live") : t("offline")}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md ring-0! rounded-sm">
          {can_go_live ? (
            <GoLiveForm
              emergencyLive={emergencyLive}
              onDone={() => setOpen(false)}
            />
          ) : (
            <MembershipRequired
              message={emergencyLive.reason_message}
              onClose={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
