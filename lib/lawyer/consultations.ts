import { AvailabilitySettings } from "@/types/lawyer/consultations";
import { http, ValidationError } from "../http";

// Update availability settings for a lawyer's consultations
type ConsultationResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors?: Partial<Record<keyof AvailabilitySettings, string>>;
    };

export async function updateAvailabilitySettings(
  values: AvailabilitySettings,
): Promise<ConsultationResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      "/api/lawyer/consultation-availability",
      values,
    );

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof AvailabilitySettings, string>>;
      return { success: false, errors };
    }

    return { success: false };
  }
}
