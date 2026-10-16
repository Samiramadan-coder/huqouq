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
import { useCallback, useEffect, useRef, useState } from "react";
import { CallType, getCallCredentials } from "./config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mic,
  MicOff,
  PhoneOff,
  TriangleAlert,
  Video,
  VideoOff,
} from "lucide-react";

export type AgoraCallProps = {
  consultationId: number;
  callType: CallType;
  remoteName: string;
  remotePhoto?: string | null;
  onLeave: () => void;
};

// Volume level (0-1) above which a participant is shown as speaking.
const SPEAKING_THRESHOLD = 0.05;

export default function AgoraCall(props: AgoraCallProps) {
  // Created once per call; the provider shares it with every hook below.
  const [client] = useState(() =>
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
  );

  return (
    <AgoraRTCProvider client={client}>
      <CallRoom {...props} />
    </AgoraRTCProvider>
  );
}

function getErrorCode(error: AgoraRTCReactError | null) {
  if (!error) return null;
  return typeof error.rtcError === "string"
    ? error.rtcError
    : error.rtcError?.code;
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

function useCallTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const startedAt = Date.now();
    const interval = setInterval(
      () => setSeconds(Math.floor((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => {
      clearInterval(interval);
      setSeconds(0);
    };
  }, [running]);

  return seconds;
}

function CallRoom({
  consultationId,
  callType,
  remoteName,
  remotePhoto,
  onLeave,
}: AgoraCallProps) {
  const t = useTranslations("Call");
  const client = useRTCClient();
  const isVideo = callType === "video";

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const { localMicrophoneTrack, error: micError } = useLocalMicrophoneTrack();
  // Audio calls never create (or ask permission for) the camera.
  const { localCameraTrack, error: cameraError } =
    useLocalCameraTrack(isVideo);

  const fetchArgs = useCallback(
    () => getCallCredentials(consultationId),
    [consultationId],
  );
  const { isConnected, error: joinError } = useJoin(fetchArgs, !leaving);

  const tracks: ILocalTrack[] = [localMicrophoneTrack, localCameraTrack].filter(
    (track): track is NonNullable<typeof track> => track !== null,
  );
  const tracksReady = !!localMicrophoneTrack && (!isVideo || !!localCameraTrack);
  usePublish(tracks, isConnected && tracksReady && !leaving);

  const localVolume = useVolumeLevel(localMicrophoneTrack ?? undefined);

  const remoteUsers = useRemoteUsers();
  const remoteUser = remoteUsers[0];
  const duration = useCallTimer(!!remoteUser);

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

  async function handleLeave() {
    setLeaving(true);
    try {
      await client.leave();
    } finally {
      // close() also stops the track and releases the mic/camera.
      localMicrophoneTrack?.close();
      localCameraTrack?.close();
      onLeave();
    }
  }

  const mediaError = micError ?? cameraError;
  const mediaErrorCode = getErrorCode(mediaError);
  const missingAppId = !process.env.NEXT_PUBLIC_AGORA_APP_ID;

  let errorMessage: string | null = null;
  if (missingAppId) {
    errorMessage = t("Errors.missingConfig");
  } else if (mediaError) {
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

        {errorMessage ? null : remoteUser ? (
          <span
            className="font-semibold tabular-nums text-accent"
            aria-label={t("duration")}
          >
            {formatDuration(duration)}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-primary/55">
            <Spinner className="size-3" />
            {isConnected ? t("waiting") : t("connecting")}
          </span>
        )}
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-sm border border-destructive/20 bg-destructive/5 px-6 py-10 text-center"
        >
          <TriangleAlert className="size-6 text-destructive" />
          <p className="max-w-sm text-sm text-primary">{errorMessage}</p>
          {mediaErrorCode === "PERMISSION_DENIED" && (
            <p className="max-w-sm text-xs text-primary/55">
              {t("Errors.permissionHint")}
            </p>
          )}
        </div>
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
            !micOn && "bg-destructive/10 text-destructive border-destructive/20",
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
          onClick={handleLeave}
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
