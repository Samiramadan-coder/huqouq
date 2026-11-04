import z from "zod";
import { T } from "@/types/shared";

export type Counts = {
  all: number;
  cancelled: number;
  completed: number;
  needs_new_time: number;
  upcoming: number;
};

type Can = {
  cancel: boolean;
  join_call: boolean;
  rate: boolean;
  reschedule: boolean;
  report: boolean;
  respond_to_report: boolean;
};

type Cancellation = {
  policy: string;
  refund_amount: number;
  refundable: boolean;
};

type Lawyer = {
  id: number;
  name: string;
  photo_url: string | null;
  specializations: string[];
};

export type ConsultationReview = {
  rating: number;
  comment: string | null;
  tags: { value: string; label: string }[] | null;
};

type Payment = {
  amount: number;
  currency: string;
  paid_at: string;
  reference: string;
  refund_amount: number | null;
  refunded_at: string | null;
};

export type Consultation = {
  brief: null | string;
  can: Can;
  cancel_reason: string;
  cancellation: Cancellation;
  cancelled_at: null | string;
  client: null;
  created_at: string;
  date: string;
  date_label: string;
  duration_minutes: number;
  ends_at: string;
  free_cancel_until: string;
  id: number;
  is_reviewed: boolean;
  join_call_opens_at: string;
  lawyer: Lawyer;
  lawyer_cancel_reason: null | string;
  lawyer_cancelled: boolean;
  lawyer_cancelled_at: null | string;
  reference: string;

  report: null;
  report_until: null;

  rescheduled: boolean;
  rescheduled_from: null | string;
  review: null | ConsultationReview;
  starts_at: string;
  status: "needs_new_time" | "upcoming" | "completed" | "cancelled";
  status_label: string;
  time: string;
  time_label: string;
  type: string;
  type_label: string;
  payment: Payment;
};

// Report Consultation
// Temporary list until the API exposes the report reasons
export const REPORT_REASONS = ["lawyer_no_show"] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export const reportFormSchema = (t: T) =>
  z.object({
    reason: z.enum(REPORT_REASONS, t("reasonRequired")),
    details: z.string().trim().min(1, t("detailsRequired")),
    files: z.array(z.instanceof(File)).optional(),
  });

export type ReportConsultationForm = z.infer<
  ReturnType<typeof reportFormSchema>
>;
