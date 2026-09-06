import { OfferFormData } from "@/types/lawyer/browse-cases";
import { http, ValidationError } from "../http";

// Submit offer response type
type SubmitOfferResponse =
  | { success: true }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof OfferFormData, string>>;
    };

export async function submitOffer(
  formData: OfferFormData,
  id: number,
): Promise<SubmitOfferResponse> {
  try {
    await http.post(`/api/lawyer/cases/${id}/offers`, formData);
    return { success: true };
  } catch (error) {
    console.error("Error submitting offer:", error);
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
