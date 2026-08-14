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
    languages: [];
    office_name: string | null;
    service_ids: [];
    specialization_ids: [];
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
        t("Fields.ProfessionalInfo.AccountType.Required"),
      ),
      office_name: z.string(),
      years_of_experience: z
        .number()
        .min(1, t("Fields.ProfessionalInfo.YearsOfExperience.Required")),
      bar_number: z
        .string()
        .min(1, t("Fields.ProfessionalInfo.BarNumber.Required"))
        .min(2, t("Fields.ProfessionalInfo.BarNumber.Min")),
      bar_degree: z.enum(
        ["court_of_cassation"],
        t("Fields.ProfessionalInfo.BarDegree.Required"),
      ),
      academic_degree: z.enum(
        ["masters"],
        t("Fields.ProfessionalInfo.AcademicDegree.Required"),
      ),
    })
    .superRefine((data, ctx) => {
      if (
        (data.account_type === "office" || data.account_type === "company") &&
        !data.office_name
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("Fields.ProfessionalInfo.OfficeName.Required"),
          path: ["office_name"],
        });
      }
    });

export type ProfessionalInfoFormValues = z.infer<
  ReturnType<typeof professionalInfoSchema>
>;
