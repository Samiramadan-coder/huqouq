"use client";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  CallRole,
  CallSchedule,
  CallEndResult,
  getEmergencyCallCredentials,
} from "@/components/client-lawyer/reusable/call/config";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import CallEnded from "@/components/client-lawyer/reusable/call/call-ended";

// The Agora SDK touches browser APIs on import, so it must never render on the server.
const AgoraCall = dynamic(
  () => import("@/components/client-lawyer/reusable/call/agora-call"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center py-16">
        <Spinner className="size-6 text-accent" />
      </div>
    ),
  },
);

// Emergency calls are short first-guidance voice calls (up to 15 minutes).
// The call API's `ends_at`, when sent, takes precedence.
const EMERGENCY_CALL_MINUTES = 15;

// Either side of an accepted emergency request: joins the voice call right
// away (the lawyer after accepting, the client after choosing to continue).
export default function EmergencyCall({
  emergencyId,
  role,
  remoteName,
  startsAt,
  onFinished,
}: {
  emergencyId: number;
  role: CallRole;
  // The other side's name shown in the call
  remoteName: string;
  // When the call started; its countdown starts from here
  startsAt: string;
  onFinished: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("Call");
  const [inCall, setInCall] = useState(true);
  const [endResult, setEndResult] = useState<CallEndResult | null>(null);

  const schedule: CallSchedule = {
    startsAt,
    durationMinutes: EMERGENCY_CALL_MINUTES,
    // No extra time after the end, unlike consultations
    bufferMinutes: 0,
  };

  function finish() {
    setEndResult(null);
    onFinished();
    router.refresh();
  }

  return (
    <>
      <Dialog open={inCall}>
        <DialogContent
          showCloseButton={false}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="sm:max-w-3xl gap-0 p-0 rounded-sm ring-0!"
        >
          <DialogHeader className="p-6 border-b border-secondary">
            <DialogTitle className="ltr:font-lora text-sm font-semibold text-primary text-start">
              {t("title", { name: remoteName })}
            </DialogTitle>
            <DialogDescription className="text-xs text-primary/45 text-start">
              {t("audioDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6">
            {inCall && (
              <AgoraCall
                getCredentials={() =>
                  getEmergencyCallCredentials(emergencyId, role)
                }
                callType="audio"
                schedule={schedule}
                remoteName={remoteName}
                onEnd={(result) => {
                  setInCall(false);
                  setEndResult(result);
                }}
                onClose={() => {
                  setInCall(false);
                  finish();
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={endResult !== null}
        onOpenChange={(isOpen) => !isOpen && finish()}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-sm gap-0 p-0 rounded-sm ring-0!"
        >
          {endResult && <CallEnded result={endResult} onDone={finish} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
