"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "../http";
import { PostLegalServiceFormData } from "@/types/client/legal-services";
import { RatingSchema } from "@/components/client-lawyer/client/legal-services/details/rate-service";
import { RequestRevisionFormValues } from "@/components/client-lawyer/client/legal-services/details/request-revision";

// Post Or Update Case
type LegalServiceResponse =
  | {
      success: true;
      message?: string;
    }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof PostLegalServiceFormData, string>>;
    };

export async function postLegalService(
  legalServiceData: PostLegalServiceFormData,
  serviceId?: number,
  removeDocumentIds: number[] = [],
): Promise<LegalServiceResponse> {
  try {
    const url = serviceId
      ? `/api/legal-services/${serviceId}`
      : "/api/legal-services";

    const formData = new FormData();

    Object.entries(legalServiceData).forEach(([key, value]) => {
      if (key === "documents" && Array.isArray(value)) {
        // Existing documents (URLs) are already stored; only upload new files
        value.forEach((file) => {
          if (file instanceof File) formData.append("documents[]", file);
        });
      } else if (value != null) {
        formData.append(key, String(value));
      }
    });

    removeDocumentIds.forEach((id) => {
      formData.append("remove_document_ids[]", String(id));
    });

    const { data } = await http.post<{
      message: string;
    }>(url, formData);

    updateTag("client-legal-services");
    if (serviceId) updateTag(`client-legal-service-${serviceId}`);
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
      ) as Partial<Record<keyof PostLegalServiceFormData, string>>;
      return { success: false, errors, message: error.responseMessage };
    }

    console.error("Error posting legal service:", error);

    return { success: false };
  }
}

// Accept Service Offer
type AcceptOfferResponse =
  { success: true; message?: string } | { success: false; message?: string };

export async function acceptServiceOffer({
  serviceId,
  offerId,
  fee,
}: {
  serviceId: number;
  offerId: number;
  fee: number;
}): Promise<AcceptOfferResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/legal-services/${serviceId}/offers/${offerId}/pay`,
      { fee, provider: "manual" },
    );
    updateTag(`client-legal-service-${serviceId}`);
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error accepting case offer:", error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    return { success: false };
  }
}

// Approve Delivery
type ApproveDeliveryResponse =
  { success: true; message?: string } | { success: false; message?: string };

export async function approveDelivery(
  serviceId: number,
): Promise<ApproveDeliveryResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/legal-services/${serviceId}/approve-delivery`,
    );
    updateTag(`client-legal-service-${serviceId}`);
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error approving delivery:", error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    return { success: false };
  }
}

// Rate Lawyer
type RateServiceResponse =
  { success: true; message?: string } | { success: false; message?: string };

export async function rateService(
  serviceId: number,
  review: RatingSchema,
): Promise<RateServiceResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/legal-services/${serviceId}/review`,
      review,
    );

    updateTag(`client-legal-service-${serviceId}`);
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error rating the lawyer:", error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    return { success: false };
  }
}

// Request Revision
type RequestRevisionResponse =
  { success: true; message?: string } | { success: false; message?: string };

export async function requestRevision(
  formData: RequestRevisionFormValues,
  serviceId: number,
): Promise<RequestRevisionResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/legal-services/${serviceId}/request-revision`,
      formData,
    );

    updateTag(`client-legal-service-${serviceId}`);
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error requesting revision:", error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    return { success: false };
  }
}
