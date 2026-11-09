"use client";

import AgoraRTC, {
  AgoraRTCProvider,
  AgoraRTCReactError,
  IAgoraRTCRemoteUser,
  ILocalTrack,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  useRemoteUserTrack,
  useRTCClient,
  useVolumeLevel,
} from "agora-rtc-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  CallType,
  CallSchedule,
  CallEndReason,
  CallEndResult,
  CallCredentials,
  CallTokenResult,
  formatSeconds,
  ENDING_SOON_MINUTES,
  RECONNECT_TIMEOUT_MS,
} from "./config";
import type {
  ConnectionState,
  ConnectionDisconnectedReason,
} from "agora-rtc-sdk-ng";
import { useCallTiming } from "@/hook/use-call-timing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Hourglass,
  Mic,
  MicOff,
  PhoneOff,
  TriangleAlert,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useFormatters } from "@/lib/format";

export type AgoraCallProps = {
  // Fetches this call's Agora credentials; called once each time the call opens
  getCredentials: () => Promise<CallTokenResult>;
  callType: CallType;
  schedule: CallSchedule;
  remoteName: string;
  remotePhoto?: string | null;
  // Shown under the other side's name (e.g. the legal area or consultation type)
  remoteSubtitle?: string;
  // Replaces the initial when there's no photo (e.g. an anonymous lawyer)
  remoteIcon?: React.ReactNode;
  // Tag in the top corner, e.g. "Emergency Legal Help"
  badge?: { label: string; tone?: "emergency" | "default" };
  // Hides the countdown (e.g. until the other side joins); defaults to shown
  showTimer?: boolean;
  // Set from outside to leave the call with this reason
  forceEnd?: CallEndReason | null;
  // Replaces the default "time almost up" warning text
  endingSoonLabel?: string;
  // Extra content under the call details (e.g. notes for the lawyer)
  details?: React.ReactNode;
  // Connected to the call for the first time, or again after a network drop
  onConnectionEvent?: (event: "joined" | "reconnected") => void;
  onEnd: (result: CallEndResult) => void;
  // Closes the dialog when the call couldn't start (no token).
  onClose: () => void;
};

type CallRoomProps = Omit<AgoraCallProps, "getCredentials" | "onClose"> & {
  credentials: CallCredentials;
};

// Volume level (0-1) above which a participant is shown as speaking.
const SPEAKING_THRESHOLD = 0.05;

export default function AgoraCall({
  getCredentials,
  onClose,
  schedule,
  ...props
}: AgoraCallProps) {
  const t = useTranslations("Call");
  // Created once per call; the provider shares it with every hook below.
  const [client] = useState(() =>
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
  );
  const [tokenResult, setTokenResult] = useState<CallTokenResult | null>(null);

  const requestCredentials = useEffectEvent(() => getCredentials());

  // The dialog mounts this only while open, so each opening gets a new token.
  useEffect(() => {
    let cancelled = false;
    requestCredentials()
      .catch((): CallTokenResult => ({ success: false }))
      .then((result) => {
        if (!cancelled) setTokenResult(result);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!tokenResult) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Spinner className="size-6 text-accent" />
      </div>
    );
  }

  if (!tokenResult.success) {
    const title =
      tokenResult.status === 403
        ? t("Errors.notOpen")
        : tokenResult.status === 422
          ? t("Errors.cannotJoin")
          : t("Errors.joinFailed");

    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-5 p-5">
        <CallError
          message={title}
          hint={
            tokenResult.status === 403 || tokenResult.status === 422
              ? tokenResult.message
              : undefined
          }
        />
        <button
          type="button"
          className="rounded-sm border border-white/20 px-5 py-2 text-sm text-white hover:bg-white/10"
          onClick={onClose}
        >
          {t("close")}
        </button>
      </div>
    );
  }

  return (
    <AgoraRTCProvider client={client}>
      <CallRoom
        {...props}
        credentials={tokenResult.credentials}
        // A closesAt passed in (e.g. the request's own call_ends_at) wins
        schedule={{
          ...schedule,
          closesAt: schedule.closesAt ?? tokenResult.endsAt,
        }}
      />
    </AgoraRTCProvider>
  );
}

function CallError({ message, hint }: { message: string; hint?: string }) {
  return (
    <div
      role="alert"
      className="flex w-full max-w-md flex-col items-center gap-3 rounded-lg border border-red-400/30 bg-destructive/20 px-6 py-10 text-center"
    >
      <TriangleAlert className="size-6 text-red-300" />
      <p className="text-sm text-white">{message}</p>
      {hint && <p className="text-xs text-white/60">{hint}</p>}
    </div>
  );
}

function getErrorCode(error: AgoraRTCReactError | null) {
  if (!error) return null;
  return typeof error.rtcError === "string"
    ? error.rtcError
    : error.rtcError?.code;
}

function CallRoom({
  credentials,
  callType,
  schedule,
  remoteName,
  remotePhoto,
  remoteSubtitle,
  remoteIcon,
  badge,
  showTimer = true,
  forceEnd,
  endingSoonLabel,
  details,
  onConnectionEvent,
  onEnd,
}: CallRoomProps) {
  const t = useTranslations("Call");
  const format = useFormatters();
  const client = useRTCClient();
  const isVideo = callType === "video";

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  // Plays (or silences) the other side's audio
  const [speakerOn, setSpeakerOn] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const { localMicrophoneTrack, error: micError } = useLocalMicrophoneTrack();
  // Audio calls never create (or ask permission for) the camera.
  const { localCameraTrack, error: cameraError } = useLocalCameraTrack(isVideo);

  const { isConnected, error: joinError } = useJoin(credentials, !leaving);

  const tracks: ILocalTrack[] = [localMicrophoneTrack, localCameraTrack].filter(
    (track): track is NonNullable<typeof track> => track !== null,
  );
  const tracksReady =
    !!localMicrophoneTrack && (!isVideo || !!localCameraTrack);
  usePublish(tracks, isConnected && tracksReady && !leaving);

  const remoteUsers = useRemoteUsers();
  const remoteUser = remoteUsers[0];
  const timing = useCallTiming(schedule);

  const identity: IdentityProps = {
    name: remoteName,
    subtitle: remoteSubtitle,
    photo: remotePhoto,
    icon: remoteIcon,
  };

  // Time spent in the call is measured from our own join, not the schedule.
  const joinedAtRef = useRef<number | null>(null);
  const reportConnection = useEffectEvent((event: "joined" | "reconnected") =>
    onConnectionEvent?.(event),
  );
  useEffect(() => {
    if (isConnected && joinedAtRef.current === null) {
      joinedAtRef.current = Date.now();
      reportConnection("joined");
    }
  }, [isConnected]);

  // Network drop: Agora moves to "RECONNECTING" and retries on its own; we
  // show "Reconnecting…" and give up after RECONNECT_TIMEOUT_MS. If Agora
  // gives up first ("DISCONNECTED" with a reason other than LEAVE, e.g.
  // NETWORK_ERROR or SERVER_ERROR), the call ends right away.
  const [reconnecting, setReconnecting] = useState(false);
  const onConnectionLost = useEffectEvent(() => endCall("connectionLost"));

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let wasReconnecting = false;

    function clearTimer() {
      if (timeout) clearTimeout(timeout);
      timeout = null;
    }

    function onStateChange(
      state: ConnectionState,
      _previous: ConnectionState,
      reason?: ConnectionDisconnectedReason,
    ) {
      // Our own leave() also ends in DISCONNECTED, with reason LEAVE
      if (state === "DISCONNECTED") {
        clearTimer();
        setReconnecting(false);
        if (reason && reason !== "LEAVE") onConnectionLost();
        return;
      }

      if (state === "RECONNECTING") {
        wasReconnecting = true;
        setReconnecting(true);
        timeout ??= setTimeout(() => onConnectionLost(), RECONNECT_TIMEOUT_MS);
        return;
      }

      if (state === "CONNECTED" && wasReconnecting) {
        wasReconnecting = false;
        clearTimer();
        setReconnecting(false);
        reportConnection("reconnected");
      }
    }

    client.on("connection-state-change", onStateChange);
    return () => {
      client.off("connection-state-change", onStateChange);
      clearTimer();
    };
  }, [client]);

  useEffect(() => {
    localMicrophoneTrack?.setMuted(!micOn);
  }, [localMicrophoneTrack, micOn]);

  // Close the local tracks if the call unmounts without pressing Leave.
  const tracksRef = useRef(tracks);
  useEffect(() => {
    tracksRef.current = tracks;
  });
  useEffect(() => {
    return () => tracksRef.current.forEach((track) => track.close());
  }, []);

  const endingRef = useRef(false);
  async function endCall(reason: CallEndReason) {
    if (endingRef.current) return;
    endingRef.current = true;
    setLeaving(true);

    const joinedAt = joinedAtRef.current;
    const durationSeconds = joinedAt ? (Date.now() - joinedAt) / 1000 : 0;

    try {
      await client.leave();
    } catch {
      // Already disconnected; nothing left to leave.
    }
    // close() also stops the track and releases the mic/camera.
    localMicrophoneTrack?.close();
    localCameraTrack?.close();
    onEnd({ reason, durationSeconds, remoteName: remoteName ?? "" });
  }

  // Leave when the parent asks (e.g. the other side never joined)
  const onForceEnd = useEffectEvent((reason: CallEndReason) => endCall(reason));
  useEffect(() => {
    if (forceEnd) onForceEnd(forceEnd);
  }, [forceEnd]);

  // Auto-leave once the extra time after the scheduled end runs out.
  const onTimeUp = useEffectEvent(() => endCall("timeEnded"));
  useEffect(() => {
    if (timing.phase === "ended") onTimeUp();
  }, [timing.phase]);

  const mediaError = micError ?? cameraError;
  const mediaErrorCode = getErrorCode(mediaError);
  let errorMessage: string | null = null;
  if (mediaError) {
    const device = micError ? t("microphone") : t("camera");
    if (mediaErrorCode === "PERMISSION_DENIED") {
      errorMessage = t("Errors.permissionDenied", { device });
    } else if (mediaErrorCode === "DEVICE_NOT_FOUND") {
      errorMessage = t("Errors.deviceNotFound", { device });
    } else if (mediaErrorCode === "NOT_READABLE") {
      errorMessage = t("Errors.deviceInUse", { device });
    } else {
      errorMessage = t("Errors.deviceFailed", { device });
    }
  } else if (joinError) {
    errorMessage = t("Errors.joinFailed");
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Top bar: what this call is, and its kind */}
      <div className="flex items-center justify-between gap-3 px-5 pt-5 sm:px-10 sm:pt-8">
        {badge ? (
          <span
            className={cn(
              "rounded-sm border px-3 py-1.5 text-xs",
              badge.tone === "emergency"
                ? "border-red-400/40 bg-destructive/20 text-red-300"
                : "border-accent/40 bg-accent/10 text-accent",
            )}
          >
            {badge.label}
          </span>
        ) : (
          <span />
        )}

        {isVideo && isConnected && showTimer && (
          <CallTimer timing={timing} compact />
        )}

        <span className="flex items-center gap-1.5 text-xs text-white/60">
          {isVideo ? (
            <Video className="size-3.5" aria-hidden="true" />
          ) : (
            <Mic className="size-3.5" aria-hidden="true" />
          )}
          {isVideo ? t("videoCall") : t("audioCall")}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-5 py-8">
        {errorMessage ? (
          <CallError
            message={errorMessage}
            hint={
              mediaErrorCode === "PERMISSION_DENIED"
                ? t("Errors.permissionHint")
                : undefined
            }
          />
        ) : isVideo ? (
          <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-lg bg-black/30">
            {remoteUser ? (
              <RemoteUser
                user={remoteUser}
                playVideo
                playAudio={speakerOn}
                cover={() => (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RemoteIdentity {...identity} status="connected" />
                  </div>
                )}
                className="size-full"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <RemoteIdentity
                  {...identity}
                  status={isConnected ? "waiting" : "connecting"}
                />
              </div>
            )}

            {remoteUser && (
              <span className="absolute bottom-3 inset-s-3 z-10 rounded-sm bg-black/50 px-2 py-1 text-xs text-white">
                {remoteName}
              </span>
            )}

            {/* Your own camera, picture-in-picture */}
            <div className="absolute top-3 inset-e-3 z-10 aspect-video w-28 overflow-hidden rounded-md border border-white/20 bg-black/40 sm:w-44">
              <LocalVideoTrack
                track={localCameraTrack}
                play
                disabled={!cameraOn}
                className="size-full"
              />
              {!cameraOn && (
                <div className="absolute inset-0 flex items-center justify-center text-white/60">
                  <VideoOff className="size-4" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>
        ) : remoteUser ? (
          <RemoteAudioIdentity
            user={remoteUser}
            speakerOn={speakerOn}
            identity={identity}
          />
        ) : (
          <RemoteIdentity
            {...identity}
            status={isConnected ? "waiting" : "connecting"}
          />
        )}

        {!isVideo && isConnected && showTimer && <CallTimer timing={timing} />}

        {reconnecting && !leaving && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-sm border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white"
          >
            <Spinner className="size-3.5" />
            {t("reconnecting")}
          </p>
        )}

        {showTimer && timing.isEndingSoon && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-sm border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-xs text-amber-200"
          >
            <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {endingSoonLabel ??
              t("endingSoon", {
                minutes: format.number(
                  schedule.endingSoonMinutes ?? ENDING_SOON_MINUTES,
                ),
              })}
          </p>
        )}

        {details}

        {timing.phase === "extraTime" && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-sm border border-red-400/30 bg-destructive/20 px-4 py-2.5 text-xs text-red-200"
          >
            <Hourglass className="size-3.5 shrink-0" aria-hidden="true" />
            {t("extraTime", {
              time: format.digits(formatSeconds(timing.secondsToHardEnd)),
            })}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 px-5 pb-8 sm:pb-12">
        <ControlButton
          label={micOn ? t("mute") : t("unmute")}
          pressed={!micOn}
          disabled={!localMicrophoneTrack || leaving}
          onClick={() => setMicOn((on) => !on)}
        >
          {micOn ? <Mic /> : <MicOff />}
        </ControlButton>

        {isVideo && (
          <ControlButton
            label={cameraOn ? t("cameraOff") : t("cameraOn")}
            pressed={!cameraOn}
            disabled={!localCameraTrack || leaving}
            onClick={() => setCameraOn((on) => !on)}
          >
            {cameraOn ? <Video /> : <VideoOff />}
          </ControlButton>
        )}

        <button
          type="button"
          disabled={leaving}
          onClick={() => endCall("left")}
          aria-label={t("leave")}
          title={t("leave")}
          className="flex size-16 items-center justify-center rounded-full bg-destructive text-white shadow-lg shadow-destructive/30 transition-colors hover:bg-destructive/90 disabled:opacity-60 [&_svg]:size-6"
        >
          {leaving ? <Spinner /> : <PhoneOff />}
        </button>

        <ControlButton
          label={speakerOn ? t("speakerOff") : t("speakerOn")}
          pressed={!speakerOn}
          onClick={() => setSpeakerOn((on) => !on)}
        >
          {speakerOn ? <Volume2 /> : <VolumeX />}
        </ControlButton>
      </div>
    </div>
  );
}

// Round control on the dark call screen; "pressed" marks the off state
function ControlButton({
  label,
  pressed,
  disabled,
  onClick,
  children,
}: {
  label: string;
  pressed: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-14 items-center justify-center rounded-full transition-colors disabled:opacity-50 [&_svg]:size-5",
        pressed
          ? "bg-white text-primary hover:bg-white/90"
          : "bg-white/10 text-white hover:bg-white/20",
      )}
    >
      {children}
    </button>
  );
}

// The countdown: time left, time to start, or the extra time
function CallTimer({
  timing,
  compact,
}: {
  timing: ReturnType<typeof useCallTiming>;
  compact?: boolean;
}) {
  const t = useTranslations("Call");
  const format = useFormatters();

  const view =
    timing.phase === "lobby"
      ? {
          seconds: timing.secondsToStart,
          label: t("startsInLabel"),
          tone: "text-white/70",
        }
      : timing.phase === "inProgress"
        ? {
            seconds: timing.secondsToEnd,
            label: t("timeLeftLabel"),
            tone: timing.isEndingSoon ? "text-amber-300" : "text-white",
          }
        : timing.phase === "extraTime"
          ? {
              seconds: timing.secondsToHardEnd,
              label: t("extraTimeLabel"),
              tone: "text-red-300",
            }
          : null;

  if (!view) return null;

  const time = format.digits(formatSeconds(view.seconds));

  if (compact) {
    return (
      <span
        role="timer"
        aria-label={view.label}
        className={cn("font-mono text-sm tabular-nums", view.tone)}
      >
        {time}
      </span>
    );
  }

  return (
    <div className="text-center">
      <p
        role="timer"
        className={cn(
          "font-mono text-5xl tracking-widest tabular-nums sm:text-6xl",
          view.tone,
        )}
      >
        {time}
      </p>
      <p className="mt-2 text-xs text-white/45">{view.label}</p>
    </div>
  );
}

type IdentityProps = {
  name: string;
  subtitle?: string;
  photo?: string | null;
  icon?: React.ReactNode;
};

type IdentityStatus =
  "connecting" | "waiting" | "connected" | "speaking" | "muted";

// The other side: avatar, name, subtitle and connection status
function RemoteIdentity({
  name,
  subtitle,
  photo,
  icon,
  status,
}: IdentityProps & { status: IdentityStatus }) {
  const t = useTranslations("Call");

  const statusView = {
    connecting: { label: t("connecting"), className: "text-white/55" },
    waiting: { label: t("waiting"), className: "text-amber-300" },
    connected: { label: t("connected"), className: "text-emerald-400" },
    speaking: { label: t("speaking"), className: "text-accent" },
    muted: { label: t("muted"), className: "text-red-300" },
  }[status];

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Avatar
        className={cn(
          "size-28 bg-white/10 ring-1 ring-white/15 transition-shadow",
          status === "speaking" && "ring-4 ring-accent/60",
          (status === "waiting" || status === "connecting") && "opacity-70",
        )}
      >
        {photo && <AvatarImage src={photo} alt={name} />}
        <AvatarFallback className="bg-white/10 text-3xl text-accent [&_svg]:size-12">
          {icon ?? name[0]}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-1">
        <p className="ltr:font-lora text-xl font-semibold text-white">{name}</p>
        {subtitle && <p className="text-sm text-white/55">{subtitle}</p>}
      </div>

      <p
        className={cn("flex items-center gap-2 text-sm", statusView.className)}
      >
        {status === "connecting" ? (
          <Spinner className="size-3.5" />
        ) : status === "muted" ? (
          <MicOff className="size-3.5" aria-hidden="true" />
        ) : (
          <span
            className={cn(
              "size-2 rounded-full bg-current",
              status === "waiting" && "animate-pulse",
            )}
            aria-hidden="true"
          />
        )}
        {statusView.label}
      </p>
    </div>
  );
}

// A joined remote in an audio call: plays its audio and shows its status
function RemoteAudioIdentity({
  user,
  speakerOn,
  identity,
}: {
  user: IAgoraRTCRemoteUser;
  speakerOn: boolean;
  identity: IdentityProps;
}) {
  const { track } = useRemoteUserTrack(user, "audio");
  const level = useVolumeLevel(track ?? undefined);

  const status: IdentityStatus = !user.hasAudio
    ? "muted"
    : level > SPEAKING_THRESHOLD
      ? "speaking"
      : "connected";

  return (
    <>
      {/* Plays the remote audio; there is no video in an audio call. */}
      <RemoteUser
        user={user}
        playAudio={speakerOn}
        playVideo={false}
        className="hidden"
      />
      <RemoteIdentity {...identity} status={status} />
    </>
  );
}
