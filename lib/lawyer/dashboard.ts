import { AuthFormActionsResponse } from "@/types/shared";
import { ProfessionalInfoFormValues } from "@/types/lawyer/dashboard";
import { http, ValidationError } from "../http";

// Professional Info
type ProfessionalInfoResponse =
  AuthFormActionsResponse<ProfessionalInfoFormValues>;

export async function updateProfessionalInfo(
  formData: ProfessionalInfoFormValues,
): Promise<ProfessionalInfoResponse> {
  try {
    await http.post("/api/lawyer/profile/professional-info", formData);

    return { success: true };
  } catch (error) {
    console.error("Error updating professional info:", error);

    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof ProfessionalInfoFormValues, string>>;

      return { success: false, errors };
    }

    return { success: false };
  }
}
