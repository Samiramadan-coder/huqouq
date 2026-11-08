"use client";

import { Siren } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AcceptEmergency from "./accept-emergency";
import EmergencyOutcome from "./emergency-outcome";
import DeclineEmergency from "./decline-emergency";
import { Emergency } from "@/types/lawyer/emergency-history";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PushNotification } from "@/features/push-notifications";
import { getIncomingEmergency } from "@/lib/lawyer/emergency-requests";
import { usePushNotificationListener } from "@/hook/use-push-notifications";
import EmergencyCall from "@/components/client-lawyer/reusable/call/emergency-call";
import { DialogIconHeader } from "../emergency-membership/sos-header-control/dialog-icon-header";

// Shows an incoming emergency request (announced by an `emergency_alert` push)
// so the lawyer can accept or decline it.
export default function EmergencyNotification() {
  const [open, setOpen] = useState(false);
  const [emergency, setEmergency] = useState<Emergency | null>(null);
  // Local clock minus server clock, so the countdown matches `expires_at`
  const [clockOffset, setClockOffset] = useState(0);

  // The accepted request whose call is open
  const [call, setCall] = useState<{
    emergency: Emergency;
    startsAt: string;
  } | null>(null);

  async function showIncomingEmergency({ data }: PushNotification) {
    if (data.type !== "emergency_alert" || call) return;

    const incoming = await getIncomingEmergency();

    if (!incoming) return;

    const serverTime = new Date(incoming.server_time).getTime();
    setClockOffset(Number.isNaN(serverTime) ? 0 : Date.now() - serverTime);
    setEmergency(incoming);
    setOpen(true);
  }

  usePushNotificationListener({
    onReceive: showIncomingEmergency,
  });

  function startCall(accepted: Emergency) {
    setOpen(false);
    setCall({ emergency: accepted, startsAt: new Date().toISOString() });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          {emergency && (
            <EmergencyRequest
              key={emergency.id}
              emergency={emergency}
              clockOffset={clockOffset}
              onAccepted={() => startCall(emergency)}
              onDone={() => setOpen(false)}
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
          startsAt={call.startsAt}
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
}: {
  emergency: Emergency;
  clockOffset: number;
  onAccepted: () => void;
  onDone: () => void;
}) {
  const t = useTranslations("Lawyer.EmergencyRequest");
  const [step, setStep] = useState<"details" | "decline">("details");

  const secondsLeft = useSecondsLeft(emergency.expires_at, clockOffset);
  const expired = secondsLeft === 0;

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
            <Info label={t("client")} value={emergency.client_first_name} />
            <Info label={t("emirate")} value={emergency.emirate_label} />
            <Info label={t("reference")} value={emergency.reference} />
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
