import { http } from "@/lib/http";
import type { NextRequest } from "next/server";

// Receives the "left" event sent with navigator.sendBeacon when the tab closes
// mid-call. A beacon can't carry the Authorization header, so it comes here
// (same origin, cookies included) and is forwarded with the user's token.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const id = Number(body?.id);
  const role = body?.role;
  const event = body?.event;

  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    (role !== "client" && role !== "lawyer") ||
    (event !== "joined" && event !== "left")
  ) {
    return new Response("Invalid call event", { status: 400 });
  }

  const path =
    role === "lawyer"
      ? `/api/lawyer/emergency/requests/${id}/call-events`
      : `/api/emergency/requests/${id}/call-events`;

  try {
    await http.post(path, { event });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Error forwarding the emergency call event "${event}":`, error);
    return new Response("Failed to report the call event", { status: 502 });
  }
}
