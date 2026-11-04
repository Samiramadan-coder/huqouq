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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  CallType,
  CallRole,
  CallSchedule,
  CallEndReason,
  CallEndResult,
  CallCredentials,
  CallTokenResult,
  formatSeconds,
  getCallCredentials,
  ENDING_SOON_MINUTES,
} from "./config";
import { useCallTiming } from "@/hook/use-call-timing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  Hourglass,
  Mic,
  MicOff,
  PhoneOff,
  TriangleAlert,
  Video,
  VideoOff,
} from "lucide-react";
import { useFormatters } from "@/lib/format";

export type AgoraCallProps = {
  consultationId: number;
  role: CallRole;
  callType: CallType;
  schedule: CallSchedule;
  remoteName: string;
  remotePhoto?: string | null;
  onEnd: (result: CallEndResult) => void;
  // Closes the dialog when the call couldn't start (no token).
  onClose: () => void;
};

type CallRoomProps = Omit<AgoraCallProps, "consultationId" | "role" | "onClose"> & {
  credentials: CallCredentials;
};

// Volume level (0-1) above which a participant is shown as speaking.
const SPEAKING_THRESHOLD = 0.05;

export default function AgoraCall({
  consultationId,
  role,
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

  // The dialog mounts this only while open, so each opening gets a new token.
  useEffect(() => {
    let cancelled = false;
    getCallCredentials(consultationId, role)
      .catch((): CallTokenResult => ({ success: false }))
      .then((result) => {
        if (!cancelled) setTokenResult(result);
      });
    return () => {
      cancelled = true;
    };
  }, [consultationId, role]);

  if (!tokenResult) {
    return (
      <div className="flex justify-center py-16">
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
      <div className="flex flex-col gap-5">
        <CallError
          message={title}
          hint={
            tokenResult.status === 403 || tokenResult.status === 422
              ? tokenResult.message
              : undefined
          }
        />
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            className="rounded-sm border-secondary font-normal"
            onClick={onClose}
          >
            {t("close")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AgoraRTCProvider client={client}>
      <CallRoom
        {...props}
        credentials={tokenResult.credentials}
        schedule={{ ...schedule, closesAt: tokenResult.endsAt }}
      />
    </AgoraRTCProvider>
  );
}

function CallError({ message, hint }: { message: string; hint?: string }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-sm border border-destructive/20 bg-destructive/5 px-6 py-10 text-center"
    >
      <TriangleAlert className="size-6 text-destructive" />
      <p className="max-w-sm text-sm text-primary">{message}</p>
      {hint && <p className="max-w-sm text-xs text-primary/55">{hint}</p>}
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
  onEnd,
}: CallRoomProps) {
  const t = useTranslations("Call");
  const format = useFormatters();
  const client = useRTCClient();
  const isVideo = callType === "video";

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
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

  const localVolume = useVolumeLevel(localMicrophoneTrack ?? undefined);

  const remoteUsers = useRemoteUsers();
  const remoteUser = remoteUsers[0];
  const timing = useCallTiming(schedule);

  // Time spent in the call is measured from our own join, not the schedule.
  const joinedAtRef = useRef<number | null>(null);
  useEffect(() => {
    if (isConnected && joinedAtRef.current === null) {
      joinedAtRef.current = Date.now();
    }
  }, [isConnected]);

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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="flex items-center gap-1.5 uppercase tracking-widest text-primary/45">
          {isVideo ? (
            <Video className="size-3" aria-hidden="true" />
          ) : (
            <Mic className="size-3" aria-hidden="true" />
          )}
          {isVideo ? t("videoCall") : t("audioCall")}
        </span>

        {!isConnected && !errorMessage ? (
          <span className="flex items-center gap-1.5 text-primary/55">
            <Spinner className="size-3" />
            {t("connecting")}
          </span>
        ) : timing.phase === "lobby" ? (
          <span className="flex items-center gap-1.5 tabular-nums text-primary/55">
            <Clock className="size-3" aria-hidden="true" />
            {t("startsIn", { time: format.digits(formatSeconds(timing.secondsToStart)) })}
          </span>
        ) : timing.phase === "inProgress" ? (
          <span
            className={cn(
              "flex items-center gap-1.5 font-semibold tabular-nums",
              timing.isEndingSoon ? "text-amber-600" : "text-accent",
            )}
          >
            <Clock className="size-3" aria-hidden="true" />
            {t("timeLeft", { time: format.digits(formatSeconds(timing.secondsToEnd)) })}
          </span>
        ) : timing.phase === "extraTime" ? (
          <span className="flex items-center gap-1.5 font-semibold tabular-nums text-destructive">
            <Hourglass className="size-3" aria-hidden="true" />
            {format.digits(formatSeconds(timing.secondsToHardEnd))}
          </span>
        ) : null}
      </div>

      {timing.isEndingSoon && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-sm border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700"
        >
          <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {t("endingSoon", { minutes: format.number(ENDING_SOON_MINUTES) })}
        </p>
      )}

      {timing.phase === "extraTime" && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-sm border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-xs text-destructive"
        >
          <Hourglass className="size-3.5 shrink-0" aria-hidden="true" />
          {t("extraTime", { time: format.digits(formatSeconds(timing.secondsToHardEnd)) })}
        </p>
      )}

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
        <div className="grid gap-3 sm:grid-cols-2">
          <VideoTile name={t("you")}>
            <LocalVideoTrack
              track={localCameraTrack}
              play
              disabled={!cameraOn}
              className="size-full"
            />
            {!cameraOn && <TileAvatar name={t("you")} />}
          </VideoTile>

          <VideoTile name={remoteName}>
            {remoteUser ? (
              <RemoteUser
                user={remoteUser}
                playVideo
                playAudio
                cover={() => (
                  <TileAvatar name={remoteName} photo={remotePhoto} />
                )}
                className="size-full"
              />
            ) : (
              <WaitingPlaceholder
                name={remoteName}
                photo={remotePhoto}
                label={t("waiting")}
              />
            )}
          </VideoTile>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <LocalAudioParticipant
            name={t("you")}
            micOn={micOn}
            level={localVolume}
          />

          {remoteUser ? (
            <RemoteAudioParticipant
              user={remoteUser}
              name={remoteName}
              photo={remotePhoto}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-secondary px-4 py-8 text-center">
              <Avatar className="size-16 opacity-50">
                <AvatarImage src={remotePhoto ?? undefined} alt={remoteName} />
                <AvatarFallback>{remoteName[0]}</AvatarFallback>
              </Avatar>
              <p className="text-xs text-primary/55">{t("waiting")}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className={cn(
            "rounded-full border-secondary",
            !micOn &&
              "bg-destructive/10 text-destructive border-destructive/20",
          )}
          disabled={!localMicrophoneTrack || leaving}
          aria-pressed={!micOn}
          aria-label={micOn ? t("mute") : t("unmute")}
          title={micOn ? t("mute") : t("unmute")}
          onClick={() => setMicOn((on) => !on)}
        >
          {micOn ? <Mic /> : <MicOff />}
        </Button>

        {isVideo && (
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className={cn(
              "rounded-full border-secondary",
              !cameraOn &&
                "bg-destructive/10 text-destructive border-destructive/20",
            )}
            disabled={!localCameraTrack || leaving}
            aria-pressed={!cameraOn}
            aria-label={cameraOn ? t("cameraOff") : t("cameraOn")}
            title={cameraOn ? t("cameraOff") : t("cameraOn")}
            onClick={() => setCameraOn((on) => !on)}
          >
            {cameraOn ? <Video /> : <VideoOff />}
          </Button>
        )}

        <Button
          type="button"
          className="rounded-sm bg-destructive font-normal text-white hover:bg-destructive/90"
          disabled={leaving}
          onClick={() => endCall("left")}
        >
          {leaving ? <Spinner /> : <PhoneOff />}
          {t("leave")}
        </Button>
      </div>
    </div>
  );
}

function VideoTile({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-sm bg-primary">
      {children}
      <span className="absolute bottom-2 inset-s-2 z-10 rounded-sm bg-black/50 px-2 py-0.5 text-xs text-white">
        {name}
      </span>
    </div>
  );
}

function TileAvatar({ name, photo }: { name: string; photo?: string | null }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-primary">
      <Avatar className="size-16">
        <AvatarImage src={photo ?? undefined} alt={name} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
    </div>
  );
}

function WaitingPlaceholder({
  name,
  photo,
  label,
}: {
  name: string;
  photo?: string | null;
  label: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
      <Avatar className="size-14 opacity-60">
        <AvatarImage src={photo ?? undefined} alt={name} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <p className="flex items-center gap-1.5 text-xs text-white/70">
        <Spinner className="size-3" />
        {label}
      </p>
    </div>
  );
}

function AudioParticipant({
  name,
  photo,
  micOn,
  speaking,
}: {
  name: string;
  photo?: string | null;
  micOn: boolean;
  speaking: boolean;
}) {
  const t = useTranslations("Call");

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-secondary px-4 py-8 text-center">
      <Avatar
        className={cn(
          "size-16 ring-2 ring-transparent ring-offset-2 transition-shadow",
          speaking && "ring-accent",
        )}
      >
        <AvatarImage src={photo ?? undefined} alt={name} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <p className="ltr:font-lora text-sm font-semibold text-primary">
          {name}
        </p>
        <p
          className={cn(
            "flex items-center justify-center gap-1 text-xs",
            !micOn
              ? "text-destructive"
              : speaking
                ? "text-accent"
                : "text-primary/45",
          )}
        >
          {micOn ? (
            <Mic className="size-3" aria-hidden="true" />
          ) : (
            <MicOff className="size-3" aria-hidden="true" />
          )}
          {!micOn ? t("muted") : speaking ? t("speaking") : t("connected")}
        </p>
      </div>
    </div>
  );
}

function LocalAudioParticipant({
  name,
  micOn,
  level,
}: {
  name: string;
  micOn: boolean;
  level: number;
}) {
  return (
    <AudioParticipant
      name={name}
      micOn={micOn}
      speaking={micOn && level > SPEAKING_THRESHOLD}
    />
  );
}

function RemoteAudioParticipant({
  user,
  name,
  photo,
}: {
  user: IAgoraRTCRemoteUser;
  name: string;
  photo?: string | null;
}) {
  const { track } = useRemoteUserTrack(user, "audio");
  const level = useVolumeLevel(track ?? undefined);

  return (
    <>
      {/* Plays the remote audio; there is no video in an audio call. */}
      <RemoteUser user={user} playAudio playVideo={false} className="hidden" />
      <AudioParticipant
        name={name}
        photo={photo}
        micOn={user.hasAudio}
        speaking={user.hasAudio && level > SPEAKING_THRESHOLD}
      />
    </>
  );
}
