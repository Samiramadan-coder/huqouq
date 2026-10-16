"use client";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import dynamic from "next/dynamic";
import CallEnded from "./call-ended";
import { PhoneCall } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCallTiming } from "@/hook/use-call-timing";
import {
  CallType,
  CallSchedule,
  CallEndResult,
  JOIN_OPENS_BEFORE_MINUTES,
} from "./config";

// The Agora SDK touches browser APIs on import, so it must never render on the server.
const AgoraCall = dynamic(() => import("./agora-call"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center py-16">
      <Spinner className="size-6 text-accent" />
    </div>
  ),
});

export default function JoinCall({
  consultationId,
  callType,
  schedule,
  remoteName,
  remotePhoto,
  label,
  consultationsHref,
}: {
  consultationId: number;
  callType: CallType;
  schedule: CallSchedule;
  remoteName: string;
  remotePhoto?: string | null;
  label: string;
  consultationsHref: string;
}) {
  const t = useTranslations("Call");
  const router = useRouter();
  const timing = useCallTiming(schedule);
  const [open, setOpen] = useState(false);
  const [endResult, setEndResult] = useState<CallEndResult | null>(null);

  const joinHint =
    timing.phase === "tooEarly"
      ? t("joinNotOpen", { minutes: JOIN_OPENS_BEFORE_MINUTES })
      : timing.phase === "ended"
        ? t("joinClosed")
        : undefined;

  function handleEnd(result: CallEndResult) {
    setOpen(false);
    setEndResult(result);
  }

  function handleDone() {
    setEndResult(null);
    router.push(consultationsHref);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Disabled buttons don't show a title, so the hint sits on a wrapper. */}
        <span title={joinHint} className="inline-flex">
          <DialogTrigger asChild>
            <Button
              className="bg-accent font-normal rounded-sm"
              disabled={!timing.canJoin}
            >
              <PhoneCall />
              {label}
            </Button>
          </DialogTrigger>
        </span>

        <DialogContent
          showCloseButton={false}
          // Only Leave (or the time running out) ends the call, so tracks and the channel are always released.
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="sm:max-w-3xl gap-0 p-0 rounded-sm ring-0!"
        >
          <DialogHeader className="p-6 border-b border-secondary">
            <DialogTitle className="ltr:font-lora text-sm font-semibold text-primary text-start">
              {t("title", { name: remoteName })}
            </DialogTitle>
            <DialogDescription className="text-xs text-primary/45 text-start">
              {callType === "video"
                ? t("videoDescription")
                : t("audioDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6">
            {open && (
              <AgoraCall
                consultationId={consultationId}
                callType={callType}
                schedule={schedule}
                remoteName={remoteName}
                remotePhoto={remotePhoto}
                onEnd={handleEnd}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={endResult !== null}
        onOpenChange={(isOpen) => !isOpen && handleDone()}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-sm gap-0 p-0 rounded-sm ring-0!"
        >
          {endResult && (
            <CallEnded result={endResult} onDone={handleDone}>
              {/* Rating / feedback section goes here. */}
            </CallEnded>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
