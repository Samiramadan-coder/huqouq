"use server";

import { http, ValidationError } from "../http";
import { OfferFormData } from "@/types/lawyer/legal-services";
import { DeliverWorkFormValues } from "@/components/client-lawyer/lawyer/active-services/details/deliver-work";
import { updateTag } from "next/cache";

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

// Submits a new offer, or updates the lawyer's existing one when `isUpdate` is set
export async function submitOffer(
  formData: OfferFormData,
  id: number,
  isUpdate = false,
): Promise<SubmitOfferResponse> {
  const url = `/api/lawyer/legal-services/${id}/offer`;

  try {
    const { data } = isUpdate
      ? await http.patch<{ message: string }>(url, formData)
      : await http.post<{ message: string }>(url, formData);
    updateTag(`lawyer-legal-service-${id}`);
    return { success: true, message: data.message };
  } catch (error) {
    if (!(error instanceof ValidationError)) {
      console.error("Error submitting offer:", error);
    }
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof OfferFormData, string>>;

      return { success: false, errors, message: error.responseMessage };
    }
    return { success: false };
  }
}

// Mark work as delivered response type
type DeliverWorkResponse =
  | {
      success: true;
      message?: string;
    }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof DeliverWorkFormValues, string>>;
    };

export async function deliverWork(
  values: DeliverWorkFormValues,
  id: number,
): Promise<DeliverWorkResponse> {
  const url = `/api/lawyer/legal-services/${id}/deliver`;

  const formData = new FormData();

  values.files.forEach((file) => {
    formData.append("files[]", file);
  });

  try {
    const { data } = await http.post<{ message: string }>(url, formData);

    updateTag(`lawyer-legal-service-${id}`);
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error delivering work:", error);
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof DeliverWorkFormValues, string>>;

      return { success: false, errors, message: error.responseMessage };
    }
    return { success: false };
  }
}
