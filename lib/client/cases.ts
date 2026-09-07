"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "../http";
import { PostCaseFormData } from "@/types/client/cases";

// Post Or Update Case
type CaseResponse =
  | { success: true }
  | {
      success: false;
      errors?: Partial<Record<keyof PostCaseFormData, string>>;
    };

export async function postCase(
  caseData: PostCaseFormData,
  caseId?: number,
): Promise<CaseResponse> {
  try {
    const url = caseId ? `/api/cases/${caseId}` : "/api/cases";
    const formData = new FormData();

    Object.entries(caseData).forEach(([key, value]) => {
      if (key === "documents" && Array.isArray(value)) {
        value.forEach((file) => {
          formData.append("documents[]", file);
        });
      } else {
        formData.append(key, value as string);
      }
    });

    await http.post(url, formData);
    return { success: true };
  } catch (error) {
    console.error("Error posting case:", error);

    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof PostCaseFormData, string>>;
      return { success: false, errors };
    }

    return { success: false };
  }
}

// Accept Case Offer
type AcceptOfferResponse =
  | { success: true }
  | { success: false; message?: string };

export async function acceptCaseOffer({
  caseId,
  offerId,
}: {
  caseId: number;
  offerId: number;
}): Promise<AcceptOfferResponse> {
  try {
    await http.post(`/api/cases/${caseId}/offers/${offerId}/accept`);
    return { success: true };
  } catch (error) {
    console.error("Error accepting case offer:", error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    return { success: false };
  }
}

// Pay The Case
type PayCaseResponse = { success: true } | { success: false; message?: string };

export async function payCase(caseId: number): Promise<PayCaseResponse> {
  try {
    await http.post(`/api/cases/${caseId}/payment/pay`, { provider: "manual" });
    updateTag(`case-${caseId}`);
    return { success: true };
  } catch (error) {
    console.error("Error paying for the case:", error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    return { success: false };
  }
}
