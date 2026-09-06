import z from "zod";
import { T } from "@/types/shared";

export const postCaseShema = (t: T) =>
  z
    .object({
      title: z
        .string()
        .min(1, t("caseTitle.required"))
        .min(2, t("caseTitle.minLength")),
      specialization_id: z.number().min(1, t("category.required")),
      description: z
        .string()
        .min(1, t("description.required"))
        .min(2, t("description.minLength"))
        .max(2000, t("description.maxLength")),
      urgency: z.string(),
      budget_min: z.number().optional(),
      budget_max: z.number().optional(),
      city: z.string().min(1, t("location.required")),
      documents: z
        .array(z.instanceof(File).or(z.string()))
        .min(1, t("documents.required")),
    })
    .superRefine((data, ctx) => {
      if (
        data.budget_min &&
        data.budget_max &&
        data.budget_min > data.budget_max
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("budget.budgetMinMax"),
          path: ["budget_min"],
        });
      }
    });

export type PostCaseFormData = z.infer<ReturnType<typeof postCaseShema>>;

export type Counts = {
  approved: number;
  pending_review: number;
  rejected: number;
  has_offers: number;
  hired: number;
  closed: number;
};

export type CaseStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "has_offers"
  | "hired"
  | "closed";

export type CaseDetails = {
  can_close: boolean;
  can_edit: boolean;
  chat_unlocked: boolean;
  closed_at: null | string;
  closed_by: null | string;
  closing_note: null | string;
  closure_requested_at: null | string;
  display_status: CaseStatus;
  display_status_label: string;
  fee_paid_at: null | string;
  has_offers: true;
  hired_at: null | string;
  budget_disclosed: boolean;
  budget_max: number;
  budget_min: number;
  city: string;
  created_at: string;
  description: string;
  documents_count: number;
  offers_count: number;
  id: number;
  rejection_reason: string | null;
  reviewed_at: string | null;
  specialization: { id: number; name: string };
  status: CaseStatus;
  status_label: string;
  title: string;
  urgency: "urgent" | "standard" | "very_urgent";
  urgency_label: string;
  documents: { id: number; name: string; url: string; size_bytes: number }[];
};

type OfferStatus =
  | "all"
  | "pending"
  | "accepted"
  | "cancelled"
  | "declined"
  | "withdrawn";

export type CaseOffer = {
  amount: number;
  created_at: string;
  expected_days: number | null;
  expected_timeline: string | null;
  id: number;
  message: string;
  status: OfferStatus;
  status_label: string;
  lawyer: {
    id: number;
    name: string;
    photo_url: string;
    specializations: string[];
    years_of_experience: number;
  };
};
