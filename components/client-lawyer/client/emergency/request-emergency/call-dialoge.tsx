"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { toDuration } from "../details-panal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Emergency } from "@/types/client/emergency";
import { useCallback, useEffect, useState } from "react";
import { PushNotification } from "@/features/push-notifications";
import { continueEmergency, getEmergency } from "@/lib/client/emergency";
import { usePushNotificationListener } from "@/hook/use-push-notifications";
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
  emergencyId,
  onClose,
}: {
  emergencyId: Emergency["id"];
  // Called once the call is over
  onClose: () => void;
}) {
  const t = useTranslations("Client.Emergency.Waiting");
  const [emergency, setEmergency] = useState<Emergency | null>(null);
  const [loadedAt, setLoadedAt] = useState(() => Date.now());
  // When the client chose to continue; the call opens from then on
  const [callStartsAt, setCallStartsAt] = useState<string | null>(null);

  // Fetches the latest state of the request
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

  // A lawyer accepted this request -> re-fetch to get the lawyer and ask the client
  usePushNotificationListener({
    onReceive: ({ data }: PushNotification) => {
      console.log(data);
      if (
        data.type === "emergency_lawyer_accepted" &&
        Number(data.id) === emergencyId &&
        !callStartsAt
      ) {
        console.log("Passsed");
        loadEmergency();
      }
    },
  });

  if (callStartsAt) {
    return (
      <EmergencyCall
        emergencyId={emergencyId}
        role="client"
        // The lawyer stays anonymous during the emergency call
        remoteName={t("anonymousLawyer")}
        startsAt={callStartsAt}
        onFinished={onClose}
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
            onRejected={loadEmergency}
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
  onRejected,
}: {
  emergency: Emergency;
  onContinue: () => void;
  onRejected: () => void;
}) {
  const t = useTranslations("Client.Emergency.Waiting");
  const [pending, setPending] = useState<"yes" | "no" | null>(null);
  const lawyer = emergency.matched_lawyer;

  async function answer(value: "yes" | "no") {
    setPending(value);
    // TEMP (testing): "yes" skips the /continue endpoint and opens the call
    // directly (the call fetches its token). Restore the line below after testing.
    // const result = await continueEmergency(emergency.id, value);
    const result =
      value === "yes"
        ? { success: true, message: undefined }
        : await continueEmergency(emergency.id, value);
    setPending(null);

    if (!result.success) {
      toast.error(result.message ?? t("failed"));
      return;
    }

    if (value === "yes") onContinue();
    else onRejected();
  }

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
          onClick={() => answer("yes")}
          disabled={pending !== null}
          className="rounded-sm h-10 px-6 bg-destructive text-white hover:bg-destructive/90"
        >
          {pending === "yes" && <Spinner />}
          {t("continue")}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => answer("no")}
          disabled={pending !== null}
          className="rounded-sm h-10 px-6 border-secondary font-normal text-primary/60"
        >
          {pending === "no" && <Spinner />}
          {t("reject")}
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
