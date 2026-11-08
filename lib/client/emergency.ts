"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "../http";
import { unstable_rethrow } from "next/navigation";
import { fetchCallToken } from "../call-token";
import { Emergency, EmergencyRequestForm } from "@/types/client/emergency";

// Request Emergency Help
type EmergencyRequestResponse =
  | {
      success: true;
      message?: string;
      emergencyId: Emergency["id"];
    }
  | {
      success: false;
      errors?: Partial<Record<keyof EmergencyRequestForm, string>>;
      message?: string;
    };

export async function requestEmergencyHelp(
  values: EmergencyRequestForm,
): Promise<EmergencyRequestResponse> {
  try {
    const { data } = await http.post<{ message: string; data: Emergency }>(
      `/api/emergency/requests`,
      {
        ...values,
        description: values.description || undefined,
      },
    );

    console.log(data);

    updateTag("emergencies");
    return { success: true, message: data.message, emergencyId: data.data.id };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof EmergencyRequestForm, string>>;
      return { success: false, errors, message: error.responseMessage };
    }
    console.error("Error requesting emergency help:", error);
    return { success: false };
  }
}

// A single emergency request, re-fetched whenever its state may have changed
export async function getEmergency(
  id: Emergency["id"],
): Promise<Emergency | null> {
  try {
    const { data } = await http.get<{ data: Emergency }>(
      `/api/emergency/requests/${id}`,
    );

    return data?.data ?? null;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error fetching emergency request:", error);
    return null;
  }
}

// Actions on an emergency request
type EmergencyActionResponse = { success: boolean; message?: string };

async function emergencyAction(
  path: string,
  body: unknown,
  context: string,
): Promise<EmergencyActionResponse> {
  try {
    const { data } = await http.post<{ message?: string }>(path, body);

    updateTag("emergencies");
    return { success: true, message: data?.message };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ValidationError) {
      const firstError = Object.values(error.errors)[0]?.[0];
      return { success: false, message: error.responseMessage ?? firstError };
    }
    console.error(context, error);
    return { success: false };
  }
}

// The client's answer once a lawyer accepted: "yes" joins the call,
// "no" sends the request back to searching for another lawyer
export async function continueEmergency(
  id: Emergency["id"],
  answer: "yes" | "no",
) {
  return emergencyAction(
    `/api/emergency/requests/${id}/continue`,
    { answer },
    "Error answering the emergency request:",
  );
}

// Agora credentials (token, channel...) for the client's emergency call
export async function requestClientEmergencyCallToken(id: Emergency["id"]) {
  return fetchCallToken(`/api/emergency/requests/${id}/call`, "get");
}
