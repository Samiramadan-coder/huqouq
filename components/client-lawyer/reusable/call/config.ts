export type CallType = "video" | "audio";

export type CallCredentials = {
  appid: string;
  channel: string;
  token: string | null;
};

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
