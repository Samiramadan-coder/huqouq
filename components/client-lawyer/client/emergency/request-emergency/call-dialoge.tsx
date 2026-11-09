"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  StateMessage,
  DailyLimitReached,
  BookConsultationButton,
  BOOK_CONSULTATION_HREF,
} from "./emergency-states";

import {
  getEmergency,
  cancelEmergency,
  requestEmergencyHelp,
  keepWaitingEmergency,
} from "@/lib/client/emergency";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { toDuration } from "../details-panal";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Emergency } from "@/types/client/emergency";
import EmergencyCallEnded from "./emergency-call-ended";
import { PushNotification } from "@/features/push-notifications";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePushNotificationListener } from "@/hook/use-push-notifications";
import { BadgeCheck, MapPin, SearchX, ShieldCheck, Users } from "lucide-react";
import EmergencyCall from "@/components/client-lawyer/reusable/call/emergency-call";

// How often the open request is re-fetched
const POLL_MS = 2_000;

// Seconds shown on "Call starts in N" before the call opens
const CALL_COUNTDOWN_SECONDS = 3;

// Statuses after which the request won't change any more
const FINISHED_STATUSES: Emergency["status"][] = [
  "no_lawyer",
  "cancelled",
  "blocked_daily_limit",
];

type Pending = "cancel" | "keepWaiting" | "book" | "retry" | null;

// Seconds since the request was created: the API's elapsed_seconds plus the
// time passed since that response arrived. Re-syncs on every re-fetch.
function useWaitingSeconds(emergency: Emergency, loadedAt: number) {
  const [now, setNow] = useState(loadedAt);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const sinceLoad = Math.max(0, (now - loadedAt) / 1000);
  return (emergency.elapsed_seconds ?? 0) + sinceLoad;
}

export default function CallDialoge({
  initialEmergency,
  onClose,
}: {
  initialEmergency: Emergency;
  onClose: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("Client.Emergency.Waiting");
  const [emergency, setEmergency] = useState<Emergency>(initialEmergency);
  const [loadedAt, setLoadedAt] = useState(() => Date.now());
  const [callStartsAt, setCallStartsAt] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending>(null);
  // The client chose "Keep waiting" after all lawyers were busy
  const [keptWaiting, setKeptWaiting] = useState(false);
  // "Try again" was refused because of the daily limit
  const [dailyLimit, setDailyLimit] = useState<{ message?: string } | null>(
    null,
  );

  const emergencyId = emergency.id;
  const loading = useRef(false);

  // Fetches the latest state of the request (skipped while one is in flight)
  const loadEmergency = useCallback(async () => {
    if (loading.current) return;
    loading.current = true;

    const data = await getEmergency(emergencyId);
    loading.current = false;

    // Ignore a response for a request that was replaced meanwhile ("Try again")
    if (!data || data.id !== emergencyId) return;

    setEmergency(data);
    setLoadedAt(Date.now());
  }, [emergencyId]);

  const finished = FINISHED_STATUSES.includes(emergency.status);

  const startCall = useCallback(
    () => setCallStartsAt(new Date().toISOString()),
    [],
  );

  // Poll while the client waits; stop once the call opens or the request ends
  useEffect(() => {
    if (callStartsAt || finished) return;

    const interval = setInterval(loadEmergency, POLL_MS);
    return () => clearInterval(interval);
  }, [callStartsAt, finished, loadEmergency]);

  // Cancelled elsewhere (e.g. another tab) -> nothing left to show
  useEffect(() => {
    if (emergency.status === "cancelled" && pending !== "cancel") onClose();
  }, [emergency.status, pending, onClose]);

  // A lawyer accepted this request -> re-fetch right away instead of waiting
  // for the next poll
  usePushNotificationListener({
    onReceive: ({ data }: PushNotification) => {
      if (
        data.type === "emergency_lawyer_accepted" &&
        Number(data.id) === emergencyId &&
        !callStartsAt
      ) {
        loadEmergency();
      }
    },
  });

  async function handleCancel() {
    setPending("cancel");
    const result = await cancelEmergency(emergencyId);
    setPending(null);

    if (!result.success) {
      toast.error(result.message ?? t("failed"));
      return;
    }

    toast.success(result.message ?? t("cancelSuccess"));
    onClose();
  }

  async function handleKeepWaiting() {
    setPending("keepWaiting");
    const result = await keepWaitingEmergency(emergencyId);
    setPending(null);

    if (!result.success) {
      toast.error(result.message ?? t("failed"));
      return;
    }

    setKeptWaiting(true);
    loadEmergency();
  }

  // All lawyers are busy and the client books a consultation instead
  async function handleBookInstead() {
    setPending("book");
    const result = await cancelEmergency(emergencyId, true);
    setPending(null);

    if (!result.success) {
      toast.error(result.message ?? t("failed"));
      return;
    }

    onClose();
    router.push(BOOK_CONSULTATION_HREF);
  }

  // No lawyer was found: send the same request again
  async function handleRetry() {
    setPending("retry");
    const result = await requestEmergencyHelp({
      legal_area_id: emergency.legal_area.id,
      emirate: emergency.emirate,
      description: emergency.description || undefined,
      accept_short_call: true,
    });
    setPending(null);

    if (result.success && result.emergency.status === "blocked_daily_limit") {
      setDailyLimit({ message: result.emergency.status_label });
      return;
    }

    if (result.success) {
      setEmergency(result.emergency);
      setLoadedAt(Date.now());
      setKeptWaiting(false);
      return;
    }

    if (result.code === "daily_limit_reached") {
      setDailyLimit({ message: result.message });
      return;
    }

    toast.error(result.message ?? t("failed"));
  }

  if (callStartsAt) {
    return (
      <EmergencyCall
        emergencyId={emergencyId}
        role="client"
        remoteName={t("anonymousLawyer")}
        remoteSubtitle={emergency.legal_area.name}
        remoteIcon={<ShieldCheck aria-hidden="true" />}
        startsAt={callStartsAt}
        onFinished={onClose}
        renderEnded={(result, onDone) => (
          <EmergencyCallEnded
            emergency={emergency}
            result={result}
            onDone={onDone}
          />
        )}
      />
    );
  }

  // A lawyer accepted and the call hasn't started yet
  const lawyerFound = Boolean(
    emergency.matched_lawyer && !emergency.continue_answer,
  );

  const allBusy =
    !lawyerFound &&
    emergency.status === "searching" &&
    emergency.all_busy &&
    !keptWaiting;

  function renderContent() {
    if (dailyLimit) {
      return (
        <DailyLimitReached message={dailyLimit.message} onClose={onClose} />
      );
    }

    if (lawyerFound) {
      return <LawyerFound emergency={emergency} onStart={startCall} />;
    }

    if (emergency.status === "no_lawyer") {
      return (
        <StateMessage
          icon={<SearchX className="size-7" aria-hidden="true" />}
          title={t("NoLawyer.title")}
          description={t("NoLawyer.description")}
        >
          <Button
            type="button"
            onClick={handleRetry}
            disabled={pending !== null}
            className="h-10 rounded-sm px-6 bg-destructive text-white hover:bg-destructive/90"
          >
            {pending === "retry" && <Spinner />}
            {t("NoLawyer.tryAgain")}
          </Button>
          <BookConsultationButton onClick={onClose} />
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={pending !== null}
            className="h-10 rounded-sm px-6 font-normal text-primary/60"
          >
            {t("close")}
          </Button>
        </StateMessage>
      );
    }

    if (allBusy) {
      return (
        <StateMessage
          icon={<Users className="size-7" aria-hidden="true" />}
          title={t("AllBusy.title")}
          description={t("AllBusy.description")}
        >
          <Button
            type="button"
            onClick={handleKeepWaiting}
            disabled={pending !== null}
            className="h-10 rounded-sm px-6"
          >
            {pending === "keepWaiting" && <Spinner />}
            {t("keepWaiting")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleBookInstead}
            disabled={pending !== null}
            className="h-10 rounded-sm border-secondary px-6"
          >
            {pending === "book" && <Spinner />}
            {t("AllBusy.bookInstead")}
          </Button>
        </StateMessage>
      );
    }

    return (
      <Searching
        emergency={emergency}
        loadedAt={loadedAt}
        showQueue={keptWaiting}
        cancelling={pending === "cancel"}
        disabled={pending !== null}
        onCancel={handleCancel}
      />
    );
  }

  return (
    // Stays open until the request ends; outside clicks and Escape are ignored
    <Dialog open>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        className="sm:max-w-lg ring-0! rounded-sm border-t-4 border-t-destructive p-8 text-center"
      >
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

// Waiting for a lawyer to accept
function Searching({
  emergency,
  loadedAt,
  showQueue,
  cancelling,
  disabled,
  onCancel,
}: {
  emergency: Emergency;
  loadedAt: number;
  showQueue: boolean;
  cancelling: boolean;
  disabled: boolean;
  onCancel: () => void;
}) {
  const t = useTranslations("Client.Emergency.Waiting");
  const format = useFormatters();
  const waitingSeconds = useWaitingSeconds(emergency, loadedAt);
  const queuePosition = emergency.queue_position;

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
          {t("description", { area: emergency.legal_area.name })}
        </DialogDescription>
      </div>

      {showQueue && queuePosition != null && (
        <p className="text-sm font-medium text-primary/70" aria-live="polite">
          {t("queuePosition", { position: format.number(queuePosition) })}
        </p>
      )}

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

      {showQueue && (
        <p className="text-xs text-primary/50">{t("AllBusy.notCharged")}</p>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={disabled}
        className="mx-auto h-10 rounded-sm px-6 border-destructive/30 bg-transparent text-destructive hover:bg-destructive/5 hover:text-destructive"
      >
        {cancelling && <Spinner />}
        {t("cancel")}
      </Button>
    </>
  );
}

// A lawyer accepted: shows who (anonymously), then opens the call
function LawyerFound({
  emergency,
  onStart,
}: {
  emergency: Emergency;
  onStart: () => void;
}) {
  const t = useTranslations("Client.Emergency.Waiting");
  const format = useFormatters();
  const lawyer = emergency.matched_lawyer;
  const [secondsLeft, setSecondsLeft] = useState(CALL_COUNTDOWN_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onStart();
      return;
    }

    const timeout = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timeout);
  }, [secondsLeft, onStart]);

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
        <ul className="mx-auto w-fit space-y-2 rounded-sm border border-secondary p-4 text-start text-sm text-primary/80">
          <li className="font-medium">
            {lawyer.legal_area || emergency.legal_area.name}
            {lawyer.experience_range && (
              <span className="text-primary/50">
                {" · "}
                {lawyer.experience_range}
              </span>
            )}
          </li>
          {lawyer.verified && (
            <li className="flex items-center gap-1.5 text-green-700">
              <BadgeCheck className="size-4" aria-hidden="true" />
              {t("verified")}
            </li>
          )}
          {lawyer.based_in && (
            <li className="flex items-center gap-1.5">
              <MapPin className="size-4 text-primary/40" aria-hidden="true" />
              {t("basedIn", { emirate: lawyer.based_in })}
            </li>
          )}
        </ul>
      )}

      <p className="text-sm font-medium text-destructive" aria-live="polite">
        {t("callStartsIn", {
          seconds: format.number(Math.max(0, secondsLeft)),
        })}
      </p>
    </>
  );
}
