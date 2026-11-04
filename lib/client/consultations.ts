"use server";

import { unstable_rethrow } from "next/navigation";
import { updateTag } from "next/cache";
import { http, ValidationError } from "../http";
import { fetchCallToken } from "../call-token";
import { RateLawyerForm } from "@/types/client/my-cases";
import { ReportConsultationForm } from "@/types/client/consultation";
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
    unstable_rethrow(error);
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

// Cancel Consultation
type CancelConsultationResponse =
  { success: true; message?: string } | { success: false; message?: string };

export async function cancelConsultation(
  consultationId: number,
): Promise<CancelConsultationResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/consultations/${consultationId}/cancel`,
    );

    updateTag(`consultations`);
    return { success: true, message: data.message };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    console.error("Error cancelling consultation:", error);
    return { success: false };
  }
}

// Rate Consultation
type RateConsultationResponse =
  { success: true; message?: string } | { success: false; message?: string };

export async function rateConsultation(
  consultationId: number,
  review: RateLawyerForm,
): Promise<RateConsultationResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/consultations/${consultationId}/review`,
      review,
    );

    updateTag(`consultations`);
    return { success: true, message: data.message };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    console.error("Error rating consultation:", error);
    return { success: false };
  }
}

// Report Consultation
type ReportConsultationResponse =
  | { success: true; message?: string }
  | {
      success: false;
      errors?: Partial<Record<keyof ReportConsultationForm, string>>;
      message?: string;
    };

export async function reportConsultation(
  consultationId: number,
  values: ReportConsultationForm,
): Promise<ReportConsultationResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/consultations/${consultationId}/report`,
      values,
    );

    updateTag(`consultations`);
    return { success: true, message: data.message };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof ReportConsultationForm, string>>;
      return { success: false, errors, message: error.responseMessage };
    }
    console.error("Error reporting consultation:", error);
    return { success: false };
  }
}

// Agora credentials for joining this consultation's call
export async function requestClientCallToken(consultationId: number) {
  return fetchCallToken(`/api/consultations/${consultationId}/call-token`);
}
