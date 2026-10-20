"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "../http";
import { BookFormValues } from "@/components/client-lawyer/client/find-lawyer/book-consultation";

// Publish Case
type PublishCaseResponse =
  | { success: true; message?: string }
  | { success: false; message?: string };

export async function sendToLawyer(
  caseId: number,
  lawyerId: number,
): Promise<PublishCaseResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/cases/${caseId}/send-to-lawyer`,
      { lawyer_id: lawyerId },
    );

    updateTag(`lawyers`);
    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    console.error("Error sending the case to the lawyer:", error);
    return { success: false };
  }
}

// Request Consultation
type RequestConsultationResponse =
  | { success: true; message?: string }
  | {
      success: false;
      errors?: Partial<Record<keyof BookFormValues, string>>;
      message?: string;
    };

export async function requestConsultation(
  lawyerId: number,
  values: BookFormValues,
): Promise<RequestConsultationResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/lawyers/${lawyerId}/consultations`,
      values,
    );

    updateTag(`lawyers`);
    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof BookFormValues, string>>;

      return { success: false, errors: errors, message: error.responseMessage };
    }
    console.error("Error requesting consultation:", error);
    return { success: false };
  }
}

// Save To favourite
type SaveToFavouriteResponse =
  | { success: true; message: string }
  | { success: false };

export async function saveToFavourite(
  lawyerId: number,
  isFavourite: boolean,
): Promise<SaveToFavouriteResponse> {
  try {
    const method = isFavourite ? "delete" : "post";
    const { data } = await http[method]<{ message: string }>(
      `/api/lawyers/${lawyerId}/favorite`,
    );

    updateTag(`lawyers`);
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error saving to favourite:", error);
    return { success: false };
  }
}
