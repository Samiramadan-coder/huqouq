"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "../http";
import { RescheduleFormValues } from "@/components/client-lawyer/client/consultations/rescheduale";

// Request Consultation
type RequestConsultationResponse =
  | { success: true; message?: string }
  | {
      success: false;
      errors?: Partial<Record<keyof RescheduleFormValues, string>>;
      message?: string;
    };

export async function rescheduleConsultation(
  consultationId: number,
  values: RescheduleFormValues,
): Promise<RequestConsultationResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/consultations/${consultationId}/reschedule`,
      values,
    );

    updateTag(`consultations`);
    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof RescheduleFormValues, string>>;
      return { success: false, errors: errors, message: error.responseMessage };
    }
    console.error("Error rescheduling consultation:", error);
    return { success: false };
  }
}
