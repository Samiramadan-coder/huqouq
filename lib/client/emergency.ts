"use server";

import { http, ValidationError } from "../http";
import { unstable_rethrow } from "next/navigation";
import { EmergencyRequestForm } from "@/types/client/emergency";

// Request Emergency Help
type EmergencyRequestResponse =
  | { success: true; message?: string }
  | {
      success: false;
      errors?: Partial<Record<keyof EmergencyRequestForm, string>>;
      message?: string;
    };

export async function requestEmergencyHelp(
  values: EmergencyRequestForm,
): Promise<EmergencyRequestResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/emergency/requests`,
      {
        ...values,
        description: values.description || undefined,
      },
    );

    return { success: true, message: data.message };
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
