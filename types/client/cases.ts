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
  all: number;
  pending_review: number;
  pending_closure: number;
  in_progress: number;
  published: number;
  pending_fees: number;
  has_offers: number;
  hired: number;
  closed: number;
  rejected: number;
  awaiting_lawyer: number;
  request_declined: number;
};

export type CaseStatus = keyof Counts;

export type Case = {
  budget_disclosed: boolean;
  budget_max: number;
  budget_min: number;
  can_close: boolean;
  can_edit: boolean;
  chat_unlocked: boolean;
  city: string;
  closed_at: null | string;
  closed_by: null | string;
  closing_note: null | string;
  closure_requested_at: null | string;
  closure_requested_by: null | string;
  created_at: string;
  description: string;
  display_status: CaseStatus;
  display_status_label: string;
  documents_count: number;
  fee_paid_at: null | string;
  has_offers: boolean;
  hired_at: null | string;
  id: number;
  is_hire_request: boolean;
  offers_count: number;
  rejection_reason: null | string;
  request_decline_reason: null | string;
  request_declined_at: null | string;
  status: CaseStatus;
  status_label: string;
  title: string;
  urgency: "urgent" | "standard" | "very_urgent";
  urgency_label: string;
  reviewed_at: null | string;
  specialization: { id: number; name: string };
  requested_lawyer: {
    id: number;
    name: string;
    photo_url: string;
  };
};

export type CaseDetails = Case & {
  accepted_offer: null | CaseOffer;
  review: null;
  reviewed_by: null | string;
  payment: null | {
    agreed_amount: number;
    currency: string;
    fee_percentage: number;
    id: number;
    lawyer_amount: number;
    note: string;
    paid_at: null | string;
    platform_fee: number;
    provider: string | null;
    reference: string;
    status: string;
    status_label: string;
  };
  documents: {
    id: number;
    name: string;
    url: string;
    size_bytes: number;
  }[];
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

export type Step = {
  at: string | null;
  key:
    | "posted"
    | "approved"
    | "offers"
    | "hired"
    | "in_progress"
    | "pending_closure"
    | "closed"
    | "reviewed";
  label: string;
  state: "done" | "current" | "upcoming";
};
