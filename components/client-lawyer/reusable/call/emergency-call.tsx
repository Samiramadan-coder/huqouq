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
  CallEndReason,
  CallEndResult,
  CALL_SCREEN_CLASS,
  getEmergencyCallCredentials,
  reportEmergencyCallEventFor,
} from "@/components/client-lawyer/reusable/call/config";

import { useEffect, useRef, useState } from "react";
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
  renderEnded,
  showTimer,
  closesAt,
  forceEnd,
  remoteSubtitle,
  remoteIcon,
}: {
  emergencyId: number;
  role: CallRole;
  remoteName: string;
  // Under the name on the call screen (e.g. the legal area)
  remoteSubtitle?: string;
  // Avatar content when there's no photo (e.g. the anonymous lawyer's shield)
  remoteIcon?: React.ReactNode;
  startsAt: string;
  onFinished: () => void;
  // Replaces the default CallEnded content after the call (e.g. the client's
  // continue / rate steps)
  renderEnded?: (result: CallEndResult, onDone: () => void) => React.ReactNode;
  // Hides the call countdown until set (defaults to shown)
  showTimer?: boolean;
  // When the call closes, from the request itself (overrides the token's ends_at)
  closesAt?: string;
  // Set to leave the call from outside (e.g. the client never joined)
  forceEnd?: CallEndReason | null;
}) {
  const router = useRouter();
  const t = useTranslations("Call");
  const [inCall, setInCall] = useState(true);
  const [endResult, setEndResult] = useState<CallEndResult | null>(null);
  // "left" is reported once: on hang-up / time up, or when the tab closes
  const leftReportedRef = useRef(false);

  function reportLeft() {
    if (leftReportedRef.current) return;
    leftReportedRef.current = true;
    reportEmergencyCallEventFor(emergencyId, role, "left");
  }

  // Closing or reloading the tab mid-call never reaches onEnd, so a beacon
  // (which survives page unload) reports "left" through our own API route
  useEffect(() => {
    if (!inCall) return;

    function onPageHide() {
      if (leftReportedRef.current) return;
      leftReportedRef.current = true;
      navigator.sendBeacon(
        "/api/emergency-call-events",
        new Blob([JSON.stringify({ id: emergencyId, role, event: "left" })], {
          type: "application/json",
        }),
      );
    }

    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [inCall, emergencyId, role]);

  const schedule: CallSchedule = {
    startsAt,
    durationMinutes: EMERGENCY_CALL_MINUTES,
    bufferMinutes: 0,
    closesAt,
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
          className={CALL_SCREEN_CLASS}
        >
          {/* Named for screen readers; the call screen shows the details */}
          <DialogHeader className="sr-only">
            <DialogTitle>{t("title", { name: remoteName })}</DialogTitle>
            <DialogDescription>
              {t("audioDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1">
            {inCall && (
              <AgoraCall
                getCredentials={() =>
                  getEmergencyCallCredentials(emergencyId, role)
                }
                callType="audio"
                schedule={schedule}
                remoteName={remoteName}
                remoteSubtitle={remoteSubtitle}
                remoteIcon={remoteIcon}
                badge={{ label: t("emergencyBadge"), tone: "emergency" }}
                showTimer={showTimer}
                forceEnd={forceEnd}
                onEnd={(result) => {
                  // Left the Agora channel (hung up or time ran out)
                  reportLeft();
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
          {endResult &&
            (renderEnded ? (
              renderEnded(endResult, finish)
            ) : (
              <CallEnded result={endResult} onDone={finish} />
            ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
