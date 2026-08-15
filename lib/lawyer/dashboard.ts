// "use server";

import { AuthFormActionsResponse } from "@/types/shared";
import {
  EducationFormValues,
  LanguagesBioFormValues,
  ProfessionalInfoFormValues,
  SpecializationsServicesFormValues,
} from "@/types/lawyer/dashboard";
import { http, ValidationError } from "../http";
import { updateTag } from "next/cache";

// Professional Info
type ProfessionalInfoResponse =
  AuthFormActionsResponse<ProfessionalInfoFormValues>;

export async function updateProfessionalInfo(
  formData: ProfessionalInfoFormValues,
): Promise<ProfessionalInfoResponse> {
  try {
    await http.post("/api/lawyer/profile/professional-info", formData);
    updateTag("lawyer-profile");
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

// Specializations & Services
type SpecializationsServicesResponse =
  AuthFormActionsResponse<SpecializationsServicesFormValues>;

export async function updateSpecializationsServices(
  formData: SpecializationsServicesFormValues,
): Promise<SpecializationsServicesResponse> {
  try {
    await http.post("/api/lawyer/profile/specializations-services", formData);
    updateTag("lawyer-profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating specializations & services:", error);

    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof SpecializationsServicesFormValues, string>>;

      return { success: false, errors };
    }

    return { success: false };
  }
}

// Languages & Bio
type LanguagesBioResponse = AuthFormActionsResponse<LanguagesBioFormValues>;

export async function updateLanguagesBio(
  formData: LanguagesBioFormValues,
): Promise<LanguagesBioResponse> {
  try {
    await http.post("/api/lawyer/profile/languages-bio", formData);
    updateTag("lawyer-profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating languages & bio:", error);

    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof LanguagesBioFormValues, string>>;

      return { success: false, errors };
    }

    return { success: false };
  }
}

// Education
type EducationResponse = AuthFormActionsResponse<EducationFormValues>;

export async function updateEducation(
  formData: EducationFormValues,
): Promise<EducationResponse> {
  const formDataWithFiles = new FormData();
  formData.entries.forEach((entry, index) => {
    formDataWithFiles.append(`entries[${index}][degree]`, entry.degree || "");
    formDataWithFiles.append(
      `entries[${index}][university]`,
      entry.university || "",
    );
    formDataWithFiles.append(
      `entries[${index}][graduation_month]`,
      entry.graduation_month.toString() || "0",
    );
    formDataWithFiles.append(
      `entries[${index}][graduation_year]`,
      entry.graduation_year.toString() || "0",
    );
    formDataWithFiles.append(
      `entries[${index}][description]`,
      entry.description || "",
    );
    if (entry.certificate && entry.certificate instanceof File) {
      formDataWithFiles.append(
        `entries[${index}][certificate]`,
        entry.certificate,
      );
    }
  });

  try {
    await http.post("/api/lawyer/profile/education", formDataWithFiles);
    // updateTag("lawyer-profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating education:", error);

    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof EducationFormValues, string>>;

      return { success: false, errors };
    }

    return { success: false };
  }
}
