import { requestClientCallToken } from "@/lib/client/consultations";
import { requestLawyerCallToken } from "@/lib/lawyer/consultations";
import { requestEmergencyCallToken } from "@/lib/lawyer/emergency-requests";
import { requestClientEmergencyCallToken } from "@/lib/client/emergency";
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
};

export type CallEndReason = "timeEnded" | "left";

export type CallEndResult = {
  reason: CallEndReason;
  durationSeconds: number;
  remoteName: string;
};

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

  return toCallTokenResult(result);
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
