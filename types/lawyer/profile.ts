import z from "zod";
import { T } from "../shared";

export type Education = {
  certificate_path: string | null;
  certificate_url: string | null;
  degree: "bachelors";
  description: string;
  graduation_month: number;
  graduation_year: number;
  university: string;
};

export type Experience = {
  certificate_path: null | string;
  certificate_url: null | string;
  description: string;
  end_month: number | null;
  end_year: number | null;
  is_current: boolean;
  organization: string;
  start_month: number;
  start_year: number;
  title: string;
};

export type Section = {
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
};

export type ProfileStatus =
  | "incomplete"
  | "in_review"
  | "complete"
  | "needs_fix";

export type LawyerProfile = {
  completion_percentage: number;
  is_editable: boolean;
  is_ready_to_submit: boolean;
  profile_status: ProfileStatus;
  rejection_reason: null | string;
  submitted_at: null | string;
  profile: {
    academic_degree: null | "masters";
    account_type: "freelance" | "company" | "office";
    bar_certificate_path: null | string;
    bar_certificate_url: null | string;
    bar_degree: null | "court_of_cassation";
    bar_number: null | string;
    bio: null | string;
    educations: Education[];
    experiences: Experience[];
    languages: string[];
    office_name: string | null;
    service_ids: number[];
    specialization_ids: number[];
    website_url: null;
    years_of_experience: null | number;
  };
  sections: Section[];
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

// Education Schema
export const educationSchema = (t: T) =>
  z.object({
    entries: z.array(
      z.object({
        degree: z.string().min(1, t("Fields.Degree.Required")),
        university: z
          .string()
          .min(1, t("Fields.University.Required"))
          .min(2, t("Fields.University.Min")),
        graduation_month: z
          .number()
          .min(1, t("Fields.GraduationMonth.Required")),
        graduation_year: z.number().min(1, t("Fields.GraduationYear.Required")),
        description: z.string().optional(),
        certificate: z.union([z.string(), z.instanceof(File)]).optional(),
      }),
    ),
  });

export type EducationFormValues = z.infer<ReturnType<typeof educationSchema>>;

// Experiences Schema
export const experiencesSchema = (t: T) =>
  z.object({
    entries: z.array(
      z.object({
        title: z
          .string()
          .min(1, t("Fields.Title.Required"))
          .min(2, t("Fields.Title.Min")),
        organization: z
          .string()
          .min(1, t("Fields.Organization.Required"))
          .min(2, t("Fields.Organization.Min")),
        start_month: z.number().min(1, t("Fields.StartMonth.Required")),
        start_year: z.number().min(1, t("Fields.StartYear.Required")),
        end_month: z.number().optional(),
        end_year: z.number().optional(),
        is_current: z.boolean().optional(),
        description: z.string().optional(),
        certificate: z.union([z.string(), z.instanceof(File)]).optional(),
      }),
    ),
  });

export type ExperiencesFormValues = z.infer<
  ReturnType<typeof experiencesSchema>
>;

// Certificate Upload Schema
export const certificateUploadSchema = (t: T) =>
  z.object({
    certificate: z.union(
      [z.string(), z.instanceof(File)],
      t("Fields.Certificate.Required"),
    ),
  });

export type CertificateUploadFormValues = z.infer<
  ReturnType<typeof certificateUploadSchema>
>;
