import { http, ValidationError } from "../http";
import { PostLegalServiceFormData } from "@/types/client/legal-services";

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
): Promise<LegalServiceResponse> {
  try {
    const url = serviceId
      ? `/api/legal-services/${serviceId}`
      : "/api/legal-services";

    const formData = new FormData();

    Object.entries(legalServiceData).forEach(([key, value]) => {
      if (key === "documents" && Array.isArray(value)) {
        value.forEach((file) => {
          formData.append("documents[]", file);
        });
      } else {
        formData.append(key, value as string);
      }
    });

    const { data } = await http.post<{
      message: string;
    }>(url, formData);

    // updateTag("cases");
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error posting legal service:", error);

    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof PostLegalServiceFormData, string>>;
      return { success: false, errors, message: error.responseMessage };
    }

    return { success: false };
  }
}
