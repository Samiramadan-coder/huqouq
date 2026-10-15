"use server";

import { http, ValidationError } from "../http";
import { AvailabilitySettings } from "@/types/lawyer/consultations";

// Update availability settings response type
type UpdateAvailabilitySettingsResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof AvailabilitySettings, string>>;
    };

// Updates the lawyer's consultation availability settings
export async function updateAvailabilitySettings(
  values: AvailabilitySettings,
): Promise<UpdateAvailabilitySettingsResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      "/api/lawyer/consultation-availability",
      values,
    );

    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof AvailabilitySettings, string>>;

      return { success: false, errors, message: error.responseMessage };
    }

    console.error("Error updating availability settings:", error);
    return { success: false };
  }
}
