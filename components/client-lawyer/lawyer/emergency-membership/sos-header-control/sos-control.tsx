"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { GoOffline } from "./go-offline";
import { GoLiveForm } from "./go-live-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { MembershipRequired } from "./membership-required";
import { EmergencyLive } from "@/types/lawyer/emergency-membership";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function SosControl({
  emergencyLive,
}: {
  emergencyLive: EmergencyLive;
}) {
  const close = () => setOpen(false);
  const [open, setOpen] = useState(false);
  const t = useTranslations("Lawyer.EmergencyLive");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-pressed={emergencyLive.is_live}
          className={cn(
            "h-9 gap-2 rounded-sm px-3 text-xs font-normal",
            emergencyLive.is_live
              ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-700"
              : "border-secondary bg-white text-primary/55 hover:bg-secondary/30 hover:text-primary/70",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              emergencyLive.is_live
                ? "bg-green-600 animate-pulse"
                : "bg-primary/25",
            )}
            aria-hidden="true"
          />
          <Zap className="size-3.5" aria-hidden="true" />
          {emergencyLive.is_live ? t("live") : t("offline")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md ring-0! rounded-sm">
        {emergencyLive.is_live && (
          <GoOffline liveUntil={emergencyLive.live_until} onDone={close} />
        )}

        {!emergencyLive.is_live &&
          (emergencyLive.reason === "needs_office_emirate" ||
            emergencyLive.reason === null) && (
            <GoLiveForm emergencyLive={emergencyLive} onDone={close} />
          )}

        {emergencyLive.reason === "not_approved" && (
          <MembershipRequired
            message={emergencyLive.reason_message}
            onClose={close}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
