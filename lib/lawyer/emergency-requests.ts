"use server";

import { unstable_rethrow } from "next/navigation";
import { http, HttpError, ValidationError, apiErrorCode } from "../http";
import { fetchCallToken } from "../call-token";
import { Emergency } from "@/types/lawyer/emergency-history";
import type { EmergencyCallEvent } from "@/components/client-lawyer/reusable/call/config";

type ActionResponse =
  | { success: true; message?: string }
  // `code` e.g. "already_taken" when another lawyer accepted first (409)
  | { success: false; message?: string; code?: string };

function toFailure(error: unknown, context: string): ActionResponse {
  if (error instanceof HttpError && error.status === 409) {
    return {
      success: false,
      code: apiErrorCode(error) ?? "already_taken",
      message: error.responseMessage,
    };
  }

  if (error instanceof ValidationError) {
    const firstError = Object.values(error.errors)[0]?.[0];
    return { success: false, message: error.responseMessage ?? firstError };
  }

  console.error(context, error);
  return { success: false };
}

// The emergency request currently offered to this lawyer, if any
export async function getIncomingEmergency(): Promise<Emergency | null> {
  try {
    const { data } = await http.get<{ data: Emergency | null }>(
      "/api/lawyer/emergency/requests/incoming",
    );

    return data?.data ?? null;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error fetching incoming emergency request:", error);
    return null;
  }
}

export async function acceptEmergency(
  id: Emergency["id"],
): Promise<ActionResponse> {
  try {
    const { data } = await http.post<{ message?: string }>(
      `/api/lawyer/emergency/requests/${id}/accept`,
    );

    return { success: true, message: data?.message };
  } catch (error) {
    unstable_rethrow(error);
    return toFailure(error, "Error accepting emergency request:");
  }
}

export async function declineEmergency(
  id: Emergency["id"],
  reason: string,
): Promise<ActionResponse> {
  try {
    const { data } = await http.post<{ message?: string }>(
      `/api/lawyer/emergency/requests/${id}/decline`,
      { reason },
    );

    return { success: true, message: data?.message };
  } catch (error) {
    unstable_rethrow(error);
    return toFailure(error, "Error declining emergency request:");
  }
}

// Agora credentials (token, channel...) for the call on an accepted request
export async function requestEmergencyCallToken(id: Emergency["id"]) {
  return fetchCallToken(`/api/lawyer/emergency/requests/${id}/call`, "get");
}

// Tells the API what happened in the call (joined, left, reconnected, or
// ended with a reason)
export async function reportLawyerEmergencyCallEvent(
  id: Emergency["id"],
  event: EmergencyCallEvent,
  reason?: string,
): Promise<ActionResponse> {
  try {
    const { data } = await http.post<{ message?: string }>(
      `/api/lawyer/emergency/requests/${id}/call-events`,
      { event, reason },
    );

    return { success: true, message: data?.message };
  } catch (error) {
    unstable_rethrow(error);
    return toFailure(
      error,
      `Error reporting the emergency call event "${event}":`,
    );
  }
}

// After the call: what came out of it, plus a private note for the lawyer
export async function recordEmergencyOutcome(
  id: Emergency["id"],
  values: { outcome: string; note?: string },
): Promise<ActionResponse> {
  try {
    const { data } = await http.post<{ message?: string }>(
      `/api/lawyer/emergency/requests/${id}/outcome`,
      values,
    );

    return { success: true, message: data?.message };
  } catch (error) {
    unstable_rethrow(error);
    return toFailure(error, "Error recording the emergency call outcome:");
  }
}

// One of this lawyer's requests, for its live call state (connected_at,
// call_ends_at, status). There's no single-request endpoint for lawyers, so
// it's looked up in the list (newest first, so an active call is on page 1).
export async function getLawyerEmergency(
  id: Emergency["id"],
): Promise<Emergency | null> {
  try {
    const { data } = await http.get<{ data: Emergency[] }>(
      "/api/lawyer/emergency/requests",
    );

    return data?.data?.find((item) => item.id === id) ?? null;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error fetching the emergency request:", error);
    return null;
  }
}
