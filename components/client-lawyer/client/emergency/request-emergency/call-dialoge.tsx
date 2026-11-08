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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Emergency } from "@/types/client/emergency";
import { getEmergency } from "@/lib/client/emergency";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PushNotification } from "@/features/push-notifications";
import { usePushNotificationListener } from "@/hook/use-push-notifications";
import EmergencyCallEnded from "./emergency-call-ended";
import EmergencyCall from "@/components/client-lawyer/reusable/call/emergency-call";

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
  initialEmergency,
  // emergencyId,
  onClose,
}: {
  initialEmergency: Emergency;
  // emergencyId: Emergency["id"];
  onClose: () => void;
}) {
  const t = useTranslations("Client.Emergency.Waiting");
  const [emergency, setEmergency] = useState<Emergency>(initialEmergency);
  const [loadedAt, setLoadedAt] = useState(() => Date.now());
  const [callStartsAt, setCallStartsAt] = useState<string | null>(null);

  // Fetches the latest state of the request
  const loadEmergency = useCallback(async () => {
    const data = await getEmergency(emergency.id);

    if (!data) {
      toast.error(t("failed"));
      return;
    }

    setEmergency(data);
    setLoadedAt(Date.now());
  }, [emergency, t]);

  // useEffect(() => {
  //   loadEmergency();
  // }, [loadEmergency]);

  // A lawyer accepted this request -> re-fetch to get the lawyer and ask the client
  usePushNotificationListener({
    onReceive: ({ data }: PushNotification) => {
      if (
        data.type === "emergency_lawyer_accepted" &&
        Number(data.id) === emergency.id &&
        !callStartsAt
      ) {
        loadEmergency();
      }
    },
  });

  if (callStartsAt) {
    return (
      <EmergencyCall
        emergencyId={emergency.id}
        role="client"
        remoteName={t("anonymousLawyer")}
        startsAt={callStartsAt}
        onFinished={onClose}
        renderEnded={(result, onDone) => (
          <EmergencyCallEnded
            emergencyId={emergency.id}
            result={result}
            onDone={onDone}
          />
        )}
      />
    );
  }

  // A lawyer accepted and the client hasn't answered yet
  const lawyerFound = Boolean(
    emergency?.matched_lawyer && !emergency.continue_answer,
  );

  return (
    // Stays open until the request ends; outside clicks and Escape are ignored
    <Dialog open>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        className="sm:max-w-lg ring-0! rounded-sm border-t-4 border-t-destructive p-8 text-center"
      >
        {emergency && lawyerFound ? (
          <LawyerFound
            emergency={emergency}
            onContinue={() => setCallStartsAt(new Date().toISOString())}
          />
        ) : (
          <Searching emergency={emergency} loadedAt={loadedAt} />
        )}
      </DialogContent>
    </Dialog>
  );
}

// Waiting for a lawyer to accept
function Searching({
  emergency,
  loadedAt,
}: {
  emergency: Emergency | null;
  loadedAt: number;
}) {
  const t = useTranslations("Client.Emergency.Waiting");
  const format = useFormatters();
  const waitingSeconds = useWaitingSeconds(emergency, loadedAt);

  return (
    <>
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
    </>
  );
}

// A lawyer accepted: the client continues to the call or asks for another lawyer
function LawyerFound({
  emergency,
  onContinue,
}: {
  emergency: Emergency;
  onContinue: () => void;
}) {
  const t = useTranslations("Client.Emergency.Waiting");
  const lawyer = emergency.matched_lawyer;

  return (
    <>
      <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary text-accent">
        <ShieldCheck className="size-8" aria-hidden="true" />
      </span>

      <div className="space-y-2">
        <DialogTitle className="text-xl ltr:font-lora">
          {t("foundTitle")}
        </DialogTitle>
        <DialogDescription>{t("foundDescription")}</DialogDescription>
      </div>

      {lawyer && (
        <dl className="grid grid-cols-3 gap-4 rounded-sm border border-secondary p-4 text-start">
          <Info label={t("legalArea")} value={lawyer.legal_area} />
          <Info label={t("basedIn")} value={lawyer.based_in} />
          <Info label={t("experience")} value={lawyer.experience_range} />
          {lawyer.verified && (
            <p className="col-span-3 flex items-center gap-1.5 text-xs font-medium text-green-700">
              <BadgeCheck className="size-4" aria-hidden="true" />
              {t("verified")}
            </p>
          )}
        </dl>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Button
          type="button"
          onClick={onContinue}
          className="rounded-sm h-10 px-6 bg-destructive text-white hover:bg-destructive/90"
        >
          {t("continue")}
        </Button>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-[11px] uppercase tracking-widest text-primary/40">
        {label}
      </dt>
      <dd className="text-sm text-primary/80 wrap-break-word">{value}</dd>
    </div>
  );
}
