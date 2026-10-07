"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "../http";
import { PostCaseFormData, RateLawyerForm } from "@/types/client/my-cases";

// Post Or Update Case
type CaseResponse =
  | {
      success: true;
      message?: string;
    }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof PostCaseFormData, string>>;
    };

export async function postCase(
  caseData: PostCaseFormData,
  caseId?: number,
  hireUrl?: string,
  removeDocumentIds: number[] = [],
): Promise<CaseResponse> {
  try {
    const url = caseId ? `/api/cases/${caseId}` : "/api/cases";
    const formData = new FormData();

    Object.entries(caseData).forEach(([key, value]) => {
      if (key === "documents" && Array.isArray(value)) {
        // Existing documents (URLs) are already stored; only upload new files
        value.forEach((file) => {
          if (file instanceof File) formData.append("documents[]", file);
        });
      } else if (value != null) {
        formData.append(key, String(value));
      }
    });

    // An empty budget never reaches this action as a key, so send it
    // explicitly as "" to let the API clear a previously saved value
    (["budget_min", "budget_max"] as const).forEach((key) => {
      if (caseData[key] == null) formData.set(key, "");
    });

    removeDocumentIds.forEach((id) => {
      formData.append("remove_document_ids[]", String(id));
    });

    const { data } = await http.post<{
      message: string;
    }>(hireUrl ?? url, formData);

    updateTag("cases");
    if (caseId) updateTag(`case-${caseId}`);
    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      // Per-file errors arrive as "documents.0"; show them on the documents field
      const errors = Object.fromEntries(
        Object.entries(error.errors)
          .reverse()
          .map(([field, messages]) => [
            field.startsWith("documents.") ? "documents" : field,
            messages[0] ?? "Invalid value",
          ]),
      ) as Partial<Record<keyof PostCaseFormData, string>>;
      return { success: false, errors, message: error.responseMessage };
    }

    console.error("Error posting case:", error);

    return { success: false };
  }
}

// Accept Case Offer
type AcceptOfferResponse =
  { success: true } | { success: false; message?: string };

export async function acceptCaseOffer({
  caseId,
  offerId,
}: {
  caseId: number;
  offerId: number;
}): Promise<AcceptOfferResponse> {
  try {
    await http.post(`/api/cases/${caseId}/offers/${offerId}/accept`);
    updateTag(`case-${caseId}`);
    return { success: true };
  } catch (error) {
    console.error("Error accepting case offer:", error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    return { success: false };
  }
}

// Decline Case Offer
type DeclineOfferResponse =
  { success: true } | { success: false; message?: string };

export async function declineCaseOffer({
  caseId,
  offerId,
}: {
  caseId: number;
  offerId: number;
}): Promise<DeclineOfferResponse> {
  try {
    await http.post(`/api/cases/${caseId}/offers/${offerId}/decline`);
    updateTag(`case-${caseId}-offers`);
    return { success: true };
  } catch (error) {
    console.error("Error declining case offer:", error);
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

// Publish Case
type PublishCaseResponse =
  { success: true; message?: string } | { success: false; message?: string };

export async function publishCase(
  caseId: number,
): Promise<PublishCaseResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/cases/${caseId}/publish-to-marketplace`,
    );

    updateTag(`cases`);
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error publishing the case:", error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    return { success: false };
  }
}

// Close Case
type CloseCaseResponse =
  { success: true; message?: string } | { success: false; message?: string };

export async function closeCase(caseId: number): Promise<CloseCaseResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/cases/${caseId}/close`,
    );
    updateTag(`case-${caseId}`);
    updateTag(`case-${caseId}-timeline`);
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error closing the case:", error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    return { success: false };
  }
}

// Rate Lawyer
type RateLawyerResponse =
  { success: true; message?: string } | { success: false; message?: string };

export async function rateLawyer({
  caseId,
  review,
}: {
  caseId: number;
  review: RateLawyerForm;
}): Promise<RateLawyerResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/cases/${caseId}/review`,
      review,
    );
    updateTag(`cases`);
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error rating the lawyer:", error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    return { success: false };
  }
}
