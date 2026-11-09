"use client";

import { EyeOff, Siren } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { playAlertSound } from "./alert-sound";
import { Button } from "@/components/ui/button";
import AcceptEmergency from "./accept-emergency";
import EmergencyOutcome from "./emergency-outcome";
import DeclineEmergency from "./decline-emergency";
import { Emergency } from "@/types/lawyer/emergency-history";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PushNotification } from "@/features/push-notifications";
import {
  getLawyerEmergency,
  getIncomingEmergency,
} from "@/lib/lawyer/emergency-requests";
import { usePushNotificationListener } from "@/hook/use-push-notifications";
import EmergencyCall from "@/components/client-lawyer/reusable/call/emergency-call";
import { DialogIconHeader } from "../emergency-membership/sos-header-control/dialog-icon-header";

// How often to check the request while the lawyer waits for the client
const CLIENT_JOIN_POLL_MS = 10_000;

// How often to check for an incoming request while live (in case a push is missed)
const INCOMING_POLL_MS = 5_000;

// How often the alert sound repeats while a request waits for an answer
const ALERT_REPEAT_MS = 2_500;

// Shows an incoming emergency request (announced by an `emergency_alert` push,
// or found by polling while the lawyer is live) so they can accept or decline it.
export default function EmergencyNotification({ isLive }: { isLive: boolean }) {
  const tCall = useTranslations("Call.Emergency");
  const [open, setOpen] = useState(false);
  // Requests already shown, so polling doesn't reopen a handled/expired one
  const shownIds = useRef(new Set<Emergency["id"]>());
  const [emergency, setEmergency] = useState<Emergency | null>(null);
  // Local clock minus server clock, so the countdown matches `expires_at`
  const [clockOffset, setClockOffset] = useState(0);

  // The accepted request whose call is open
  const [call, setCall] = useState<{
    emergency: Emergency;
    startsAt: string;
    // From the request once the client joins: the timer shows from then on,
    // counting from `connected_at` and closing at `call_ends_at`
    clientJoined: boolean;
    closesAt?: string;
    // The backend dropped the request before the client joined
    clientNoShow: boolean;
  } | null>(null);

  // Applies the request's live call state to the open call
  const syncCall = useCallback(async (id: Emergency["id"]) => {
    const latest = await getLawyerEmergency(id);
    if (!latest) return;

    // Re-sync with the server clock for the countdown
    const serverTime = new Date(latest.server_time).getTime();
    if (!Number.isNaN(serverTime)) setClockOffset(Date.now() - serverTime);

    setCall((current) => {
      if (!current || current.emergency.id !== id || current.clientJoined) {
        return current;
      }

      if (latest.call.connected_at) {
        return {
          ...current,
          clientJoined: true,
          startsAt: latest.call.connected_at,
          closesAt: latest.call.call_ends_at ?? undefined,
        };
      }

      // Still waiting while the call is open; anything else means it ended
      return latest.status === "in_call"
        ? current
        : { ...current, clientNoShow: true };
    });
  }, []);

  // While waiting for the client, check the request in case the
  // `emergency_client_joined` push never arrives or the backend drops it
  const waitingForClientId =
    call && !call.clientJoined && !call.clientNoShow ? call.emergency.id : null;

  useEffect(() => {
    if (waitingForClientId === null) return;

    const interval = setInterval(
      () => syncCall(waitingForClientId),
      CLIENT_JOIN_POLL_MS,
    );
    return () => clearInterval(interval);
  }, [waitingForClientId, syncCall]);

  // Opens the request currently offered to this lawyer, if it's a new one
  const checkIncoming = useCallback(async () => {
    const incoming = await getIncomingEmergency();

    if (!incoming || shownIds.current.has(incoming.id)) return;
    shownIds.current.add(incoming.id);

    const serverTime = new Date(incoming.server_time).getTime();
    setClockOffset(Number.isNaN(serverTime) ? 0 : Date.now() - serverTime);
    setEmergency(incoming);
    setOpen(true);
  }, []);

  function onPush({ data }: PushNotification) {
    // The client joined the open call -> take its real start / end times
    if (data.type === "emergency_client_joined") {
      if (call?.emergency.id === Number(data.id)) syncCall(call.emergency.id);
      return;
    }

    if (data.type !== "emergency_alert" || call || open) return;

    checkIncoming();
  }

  usePushNotificationListener({
    onReceive: onPush,
  });

  // While live and free, poll for incoming requests as a fallback to the push
  const shouldPollIncoming = isLive && !open && !call;

  useEffect(() => {
    if (!shouldPollIncoming) return;

    const interval = setInterval(checkIncoming, INCOMING_POLL_MS);
    return () => clearInterval(interval);
  }, [shouldPollIncoming, checkIncoming]);

  function startCall(accepted: Emergency) {
    setOpen(false);
    setCall({
      emergency: accepted,
      startsAt: new Date().toISOString(),
      clientJoined: false,
      clientNoShow: false,
    });
  }

  return (
    <>
      {/* Closes only by accepting, declining, or after it expires */}
      <Dialog open={open}>
        <DialogContent
          showCloseButton={false}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          className="sm:max-w-md"
        >
          {emergency && (
            <EmergencyRequest
              key={emergency.id}
              emergency={emergency}
              clockOffset={clockOffset}
              onAccepted={() => startCall(emergency)}
              onDone={() => setOpen(false)}
              onTaken={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {call && (
        <EmergencyCall
          key={call.emergency.id}
          emergencyId={call.emergency.id}
          role="lawyer"
          remoteName={call.emergency.client_first_name}
          remoteSubtitle={tCall("emergencyClient")}
          startsAt={call.startsAt}
          showTimer={call.clientJoined}
          closesAt={call.closesAt}
          clockOffsetMs={clockOffset}
          details={<LawyerCallNotes emergency={call.emergency} />}
          forceEnd={call.clientNoShow ? "remoteNoShow" : null}
          onFinished={() => setCall(null)}
          renderEnded={(result, onDone) => (
            <EmergencyOutcome
              emergencyId={call.emergency.id}
              result={result}
              onDone={onDone}
            />
          )}
        />
      )}
    </>
  );
}

// Count down
function useSecondsLeft(expiresAt: string, clockOffset: number) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const expiry = new Date(expiresAt).getTime();

  if (Number.isNaN(expiry)) return null;

  return Math.max(0, Math.ceil((expiry - (now - clockOffset)) / 1000));
}

// Dialoge
function EmergencyRequest({
  emergency,
  clockOffset,
  onAccepted,
  onDone,
  onTaken,
}: {
  emergency: Emergency;
  clockOffset: number;
  onAccepted: () => void;
  onDone: () => void;
  onTaken: () => void;
}) {
  const t = useTranslations("Lawyer.EmergencyRequest");
  const [step, setStep] = useState<"details" | "decline">("details");

  const secondsLeft = useSecondsLeft(emergency.expires_at, clockOffset);
  const expired = secondsLeft === 0;

  // Time's up -> the overlay closes on its own
  useEffect(() => {
    if (expired) onDone();
  }, [expired, onDone]);

  // Alert sound, repeated until the lawyer answers or the request expires
  useEffect(() => {
    if (expired) return;

    playAlertSound();
    const interval = setInterval(playAlertSound, ALERT_REPEAT_MS);
    return () => clearInterval(interval);
  }, [expired]);

  return (
    <>
      <DialogIconHeader
        icon={<Siren className="size-5" aria-hidden="true" />}
        iconClassName="bg-destructive/10 text-destructive"
        title={step === "details" ? t("title") : t("Decline.title")}
        description={step === "details" ? t("description") : undefined}
      />

      <p
        aria-live="polite"
        className={
          expired
            ? "text-sm font-medium text-destructive"
            : "text-sm font-medium text-primary/70"
        }
      >
        {expired
          ? t("expired")
          : secondsLeft != null && t("secondsLeft", { count: secondsLeft })}
      </p>

      {step === "details" && (
        <>
          <dl className="grid grid-cols-2 gap-4 rounded-sm border border-secondary p-4">
            <div className="col-span-2">
              <Info
                label={t("legalArea")}
                value={emergency.legal_area?.name ?? "—"}
              />
            </div>
            <Info label={t("client")} value={emergency.client_first_name} />
            <Info label={t("emirate")} value={emergency.emirate_label} />
            <div className="col-span-2">
              <Info
                label={t("details")}
                value={emergency.description || t("noDetails")}
              />
            </div>
          </dl>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={expired}
              onClick={() => setStep("decline")}
              className="h-11 rounded-sm border-secondary font-normal text-primary/60"
            >
              {t("decline")}
            </Button>
            <AcceptEmergency
              emergencyId={emergency.id}
              disabled={expired}
              onAccepted={onAccepted}
              onTaken={onTaken}
            />
          </div>
        </>
      )}

      {step === "decline" && (
        <DeclineEmergency
          emergencyId={emergency.id}
          disabled={expired}
          onBack={() => setStep("details")}
          onDone={onDone}
        />
      )}
    </>
  );
}

// On the lawyer's call screen: the anonymity note and what the client wrote
function LawyerCallNotes({ emergency }: { emergency: Emergency }) {
  const t = useTranslations("Call.Emergency");

  return (
    <div className="w-full max-w-md space-y-3 text-center">
      <p className="flex items-center justify-center gap-2 text-xs text-white/60">
        <EyeOff className="size-3.5 shrink-0" aria-hidden="true" />
        {t("identityHidden")}
      </p>

      {emergency.description && (
        <div className="rounded-sm border border-white/15 bg-white/5 p-4 text-start">
          <p className="text-[11px] uppercase tracking-widest text-white/45">
            {t("whatHappened")}
          </p>
          <p className="mt-1 text-sm text-white/85 wrap-break-word">
            {emergency.description}
          </p>
        </div>
      )}
    </div>
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
