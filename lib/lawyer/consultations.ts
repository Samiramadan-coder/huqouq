"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "../http";
import {
  AvailabilitySettings,
  CancelConsultationFormValues,
} from "@/types/lawyer/consultations";

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

// Cancel consultation response type
type CancelConsultationResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof CancelConsultationFormValues, string>>;
    };

// Cancels one of the lawyer's booked consultations
export async function cancelConsultation(
  id: number,
  values: CancelConsultationFormValues,
): Promise<CancelConsultationResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/lawyer/consultations/${id}/cancel`,
      values,
    );

    updateTag("lawyer-consultations");
    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        success: false,
        errors: { reason: error.errors.reason?.[0] },
        message: error.responseMessage,
      };
    }

    console.error("Error cancelling consultation:", error);
    return { success: false };
  }
}
