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
      emergency: Emergency;
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
    return { success: true, message: data.message, emergency: data.data };
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

// Agora credentials (token, channel...) for the client's emergency call
export async function requestClientEmergencyCallToken(id: Emergency["id"]) {
  return fetchCallToken(`/api/emergency/requests/${id}/call`, "get");
}
