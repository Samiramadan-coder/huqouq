export type CallType = "video" | "audio";

export type CallCredentials = {
  appid: string;
  channel: string;
  token: string | null;
};

export type CallSchedule = {
  startsAt: string;
  durationMinutes: number;
  bufferMinutes?: number;
};

export type CallEndReason = "timeEnded" | "left";

export type CallEndResult = {
  reason: CallEndReason;
  durationSeconds: number;
};

// Join opens this many minutes before the scheduled start.
export const JOIN_OPENS_BEFORE_MINUTES = 5;
// A "time almost up" warning shows when this many minutes are left.
export const ENDING_SOON_MINUTES = 5;
// Extra time after the scheduled end. Bookings don't expose a buffer yet, so
// pass `bufferMinutes` in the schedule once the API returns it.
export const DEFAULT_BUFFER_MINUTES = 0;

// Testing only. When set, it OVERRIDES the schedule passed to the call: every
// booking starts when the page loads and uses these durations, ignoring
// startsAt/durationMinutes. e.g. { durationMinutes: 2, bufferMinutes: 1 }
export const MOCK_SCHEDULE: Omit<CallSchedule, "startsAt"> | null = null;

let mockStartsAt: number | null = null;

// Client-only: the mock start is fixed the first time it's read in the browser.
export function getMockStartsAt() {
  mockStartsAt ??= Date.now();
  return mockStartsAt;
}

// Temporary values for the Agora test project. Replace getCallCredentials with
// a request to the API (channel will be `booking_${id}`, token per booking).
const CHANNEL = "test";
const TOKEN =
  "007eJxTYGB463QgPkLKiyP4dODZeqfbuRIK//ZlMsXdXzt98pGw8ysVGFIM0gwNTc2S0izNUk0SDU0TjdNSk1KTTU3NUlMTU9IsJzNfymoIZGSYwC3KwsgAgSA+C0NJanEJAwMAME0fRA==";

export async function getCallCredentials(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  consultationId: number,
): Promise<CallCredentials> {
  return {
    appid: process.env.NEXT_PUBLIC_AGORA_APP_ID ?? "",
    channel: CHANNEL,
    token: TOKEN,
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
