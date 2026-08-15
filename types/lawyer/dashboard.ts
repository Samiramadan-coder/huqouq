import z from "zod";
import { T } from "../shared";

export type LawyerProfile = {
  completion_percentage: number;
  is_editable: boolean;
  is_ready_to_submit: boolean;
  profile_status: "incomplete" | "complete" | "in_review" | "needs_fix";
  rejection_reason: null | string;
  submitted_at: null | string;
  profile: {
    academic_degree: null | "masters";
    account_type: "freelance" | "company" | "office";
    bar_certificate_path: null;
    bar_certificate_url: null;
    bar_degree: null | "court_of_cassation";
    bar_number: null | string;
    bio: null;
    educations: [];
    experiences: [];
    languages: string[];
    office_name: string | null;
    service_ids: number[];
    specialization_ids: number[];
    website_url: null;
    years_of_experience: null | number;
  };
  sections: {
    is_complete: boolean;
    key:
      | "professional_info"
      | "specializations_services"
      | "languages_bio"
      | "education"
      | "experience"
      | "bar_certificate";
    label: string;
    reason: null | string;
    status: "pending" | "approved" | "rejected";
    weight: number;
  }[];
};

// Professional Info Schema
export const professionalInfoSchema = (t: T) =>
  z
    .object({
      account_type: z.enum(
        ["freelance", "company", "office"],
        t("Fields.AccountType.Required"),
      ),
      office_name: z.string(),
      years_of_experience: z
        .number()
        .min(1, t("Fields.YearsOfExperience.Required")),
      bar_number: z
        .string()
        .min(1, t("Fields.BarNumber.Required"))
        .min(2, t("Fields.BarNumber.Min")),
      bar_degree: z.enum(
        ["court_of_cassation"],
        t("Fields.BarDegree.Required"),
      ),
      academic_degree: z.enum(["masters"], t("Fields.AcademicDegree.Required")),
    })
    .superRefine((data, ctx) => {
      if (
        (data.account_type === "office" || data.account_type === "company") &&
        !data.office_name
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("Fields.OfficeName.Required"),
          path: ["office_name"],
        });
      }
    });

export type ProfessionalInfoFormValues = z.infer<
  ReturnType<typeof professionalInfoSchema>
>;

// Specializations & Services Schema
export const specializationsServicesSchema = (t: T) =>
  z.object({
    specialization_ids: z
      .array(z.number())
      .min(1, t("Fields.Specializations.Required")),
    service_ids: z.array(z.number()).min(1, t("Fields.Services.Required")),
  });

export type SpecializationsServicesFormValues = z.infer<
  ReturnType<typeof specializationsServicesSchema>
>;

// Languages & Bio Schema
export const languagesBioSchema = (t: T) =>
  z.object({
    languages: z.array(z.string()).min(1, t("Fields.Languages.Required")),
    bio: z.string().optional(),
    website_url: z.string().optional(),
  });

export type LanguagesBioFormValues = z.infer<
  ReturnType<typeof languagesBioSchema>
>;
