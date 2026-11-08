"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { toDuration } from "../details-panal";
import { Spinner } from "@/components/ui/spinner";
import { Emergency } from "@/types/client/emergency";
import { getEmergency } from "@/lib/client/emergency";
import { useCallback, useEffect, useState } from "react";
import { usePushNotificationListener } from "@/hook/use-push-notifications";
import { PushNotification } from "@/features/push-notifications";

// Seconds since the request was created: the API's elapsed_seconds plus the
// time passed since that response arrived. Re-syncs on every re-fetch.
function useWaitingSeconds(emergency: Emergency | null, loadedAt: number) {
  const [now, setNow] = useState(loadedAt);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!emergency) return 0;
  const sinceLoad = Math.max(0, (now - loadedAt) / 1000);
  return (emergency.elapsed_seconds ?? 0) + sinceLoad;
}

export default function CallDialoge({
  emergencyId,
}: {
  emergencyId: Emergency["id"];
}) {
  const t = useTranslations("Client.Emergency.Waiting");
  const format = useFormatters();
  const [emergency, setEmergency] = useState<Emergency | null>(null);
  const [loadedAt, setLoadedAt] = useState(() => Date.now());
  const waitingSeconds = useWaitingSeconds(emergency, loadedAt);

  // Fetches the latest state of the request; also the hook for realtime
  // updates (e.g. a lawyer accepted -> re-fetch to join the call)
  const loadEmergency = useCallback(async () => {
    const data = await getEmergency(emergencyId);

    if (!data) {
      toast.error(t("failed"));
      return;
    }

    setEmergency(data);
    setLoadedAt(Date.now());
  }, [emergencyId, t]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- state is set after the fetch resolves
    loadEmergency();
  }, [loadEmergency]);

  usePushNotificationListener({
    onReceive: (data: PushNotification) => {
      // console.log(data);
      if (data.data.type === "emergency_lawyer_accepted") {
        // hit the ednd point again and show dialoge to accept or reject this call
      }
    },
    // onClick: (data: PushNotification) => {
    //   console.log(data);
    // },
  });

  return (
    // Stays open until the client cancels; outside clicks and Escape are ignored
    <Dialog open>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        className="sm:max-w-lg ring-0! rounded-sm border-t-4 border-t-destructive p-8 text-center"
      >
        <div className="mx-auto flex size-28 items-center justify-center rounded-full border border-destructive/10">
          <div className="flex size-20 items-center justify-center rounded-full border border-destructive/15">
            <div className="relative flex size-12 items-center justify-center rounded-full border border-dashed border-destructive/25">
              <span
                className="absolute size-5 animate-ping rounded-full bg-destructive/40"
                aria-hidden="true"
              />
              <span className="relative size-5 rounded-full bg-destructive shadow-md shadow-destructive/40" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <DialogTitle className="text-xl ltr:font-lora">
            {t("title")}
          </DialogTitle>
          <DialogDescription>
            {emergency ? (
              t("description", { area: emergency.legal_area.name })
            ) : (
              <Spinner className="mx-auto" />
            )}
          </DialogDescription>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-primary/40">{t("waitingTime")}</p>
          <p
            className="font-mono text-3xl tracking-widest text-destructive"
            role="timer"
            aria-live="off"
          >
            {format.digits(toDuration(waitingSeconds))}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
