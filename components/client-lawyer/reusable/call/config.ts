import { requestClientCallToken } from "@/lib/client/consultations";
import { requestLawyerCallToken } from "@/lib/lawyer/consultations";
import {
  requestEmergencyCallToken,
  reportLawyerEmergencyCallEvent,
} from "@/lib/lawyer/emergency-requests";
import {
  reportEmergencyCallEvent,
  requestClientEmergencyCallToken,
} from "@/lib/client/emergency";
import type { CallTokenResponse } from "@/lib/call-token";

export type CallType = "video" | "audio";

export type CallRole = "client" | "lawyer";

// Shape passed to Agora's useJoin. The token is bound to this uid.
export type CallCredentials = {
  appid: string;
  channel: string;
  token: string;
  uid: number | string;
};

// Response of POST .../consultations/{id}/call-token
export type CallTokenData = {
  app_id: string;
  channel: string;
  token: string;
  uid: number | string;
  ends_at: string;
};

export type CallTokenResult =
  | { success: true; credentials: CallCredentials; endsAt: string }
  | { success: false; status?: number; message?: string };

export type CallSchedule = {
  startsAt: string;
  durationMinutes: number;
  joinOpensAt?: string;
  bufferMinutes?: number;
  // When the call closes (the call-token API's ends_at); auto-leave happens then.
  closesAt?: string;
  // Local clock minus the server clock (ms), so the countdown follows the
  // server's time instead of the browser's. Defaults to 0.
  clockOffsetMs?: number;
  // When the "time almost up" warning shows (defaults to ENDING_SOON_MINUTES)
  endingSoonMinutes?: number;
};

// "remoteNoShow": ended because the other side never joined (emergency calls)
// "connectionLost": the connection didn't come back within RECONNECT_TIMEOUT_MS
export type CallEndReason =
  "timeEnded" | "left" | "remoteNoShow" | "connectionLost";

// How long to keep trying to reconnect after the network drops
export const RECONNECT_TIMEOUT_MS = 60_000;

// Emergency call events reported to the API
export type EmergencyCallEvent = "joined" | "left" | "reconnected" | "ended";

// The `reason` sent with the "ended" event
export const EMERGENCY_END_REASONS: Record<CallEndReason, string> = {
  timeEnded: "time_up",
  left: "hung_up",
  remoteNoShow: "no_show",
  connectionLost: "connection_lost",
};

export type CallEndResult = {
  reason: CallEndReason;
  durationSeconds: number;
  remoteName: string;
};

// The full-screen dark dialog every call (consultation or emergency) opens in
export const CALL_SCREEN_CLASS =
  "top-0 inset-s-0 translate-x-0 rtl:translate-x-0 translate-y-0 flex h-dvh w-full max-w-none sm:max-w-none flex-col gap-0 overflow-y-auto rounded-none p-0 ring-0! text-white bg-[color-mix(in_oklab,var(--primary)_65%,black)]";

// A "time almost up" warning shows when this many minutes are left.
export const ENDING_SOON_MINUTES = 5;

// Asks the API for this consultation's Agora app id, channel, token and uid.
// A new token is requested every time the call is opened.
export async function getCallCredentials(
  consultationId: number,
  role: CallRole,
): Promise<CallTokenResult> {
  const result =
    role === "lawyer"
      ? await requestLawyerCallToken(consultationId)
      : await requestClientCallToken(consultationId);

  return toCallTokenResult(result);
}

// Agora credentials for either side's call on an accepted emergency request
export async function getEmergencyCallCredentials(
  emergencyRequestId: number,
  role: CallRole,
): Promise<CallTokenResult> {
  const result =
    role === "lawyer"
      ? await requestEmergencyCallToken(emergencyRequestId)
      : await requestClientEmergencyCallToken(emergencyRequestId);

  // "joined" is reported once the Agora connection is up (see EmergencyCall)
  return toCallTokenResult(result);
}

// Sends a call event to the right side's emergency endpoint; `reason` goes
// with "ended". A failed report never blocks the call.
export async function reportEmergencyCallEventFor(
  emergencyRequestId: number,
  role: CallRole,
  event: EmergencyCallEvent,
  reason?: string,
) {
  return role === "lawyer"
    ? reportLawyerEmergencyCallEvent(emergencyRequestId, event, reason)
    : reportEmergencyCallEvent(emergencyRequestId, event, reason);
}

function toCallTokenResult(result: CallTokenResponse): CallTokenResult {
  if (!result.success) return result;

  const { app_id, channel, token, uid, ends_at } = result.data;
  return {
    success: true,
    credentials: { appid: app_id, channel, token, uid },
    endsAt: ends_at,
  };
}

// Consultation `type` values are "video" or a voice/phone value; anything that
// isn't video is treated as an audio-only call (same rule as the type icons).
export function toCallType(consultationType: string): CallType {
  return consultationType === "video" ? "video" : "audio";
}

export function formatSeconds(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}
