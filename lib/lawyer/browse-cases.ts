"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "../http";
import { OfferFormData } from "@/types/lawyer/browse-cases";

// Submit offer response type
type SubmitOfferResponse =
  | {
      success: true;
      message?: string;
    }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof OfferFormData, string>>;
    };

export async function submitOffer(
  formData: OfferFormData,
  id: number,
  hireUrl?: string,
): Promise<SubmitOfferResponse> {
  const url = `/api/lawyer/cases/${id}/offers`;

  try {
    const { data } = await http.post<{ message: string }>(
      hireUrl ?? url,
      formData,
    );
    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof OfferFormData, string>>;

      return { success: false, errors, message: error.responseMessage };
    }
    console.error("Error submitting offer:", error);
    return { success: false };
  }
}

// Decline offer response type
type DeclineOfferResponse =
  | {
      success: true;
      message?: string;
    }
  | {
      success: false;
      message?: string;
    };

export async function declineOffer(
  caseId: number,
): Promise<DeclineOfferResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/lawyer/hire-requests/${caseId}/decline`,
    );

    updateTag("lawyer-hire-requests");
    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    console.error("Error declining offer:", error);
    return { success: false };
  }
}
