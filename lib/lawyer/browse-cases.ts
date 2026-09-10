import { OfferFormData } from "@/types/lawyer/browse-cases";
import { http, ValidationError } from "../http";

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
