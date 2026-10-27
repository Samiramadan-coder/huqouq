import z from "zod";
import { T } from "../shared";
import { CaseType, CourtType, ExecutionType } from "../reference-data";

export type Case = {
  budget_disclosed: boolean;
  budget_max: number | null;
  budget_min: number | null;
  case_type: CaseType;
  case_type_label: string;
  city: string;
  city_label: string;
  court_type?: CourtType;
  court_type_label?: string;
  description: string;
  documents_count: number;
  execution_type?: ExecutionType;
  execution_type_label?: string;
  id: number;
  offers_count: number;
  posted_at: string;
  specialization: { id: number; name: string };
  status:
    | "published"
    | "in_progress"
    | "pending_fees"
    | "pending_closure"
    | "closed";
  status_label: string;
  title: string;
  urgency: "urgent" | "standard" | "very_urgent";
  urgency_label: string;
};

export type MyOffer = {
  amount: number;
  win_percentage: number | null;
  message: string;
};

export type CaseDetails = Case & {
  agreement: null | {
    agreed_amount: number;
    currency: string;
    fee_paid_at: string;
    fee_percentage: number;
    lawyer_amount: number;
    note: string;
    paid_at: string;
    platform_fee: number;
    status: string;
    status_label: string;
  };
  can_submit_offer: boolean;
  closure_note: null | string;
  closure_requested_at: null | string;
  closure_requested_by: null | string;
  is_hired: boolean;
  my_offer: null | {
    amount: number;
    created_at: string;
    display_status:
      | "in_progress"
      | "pending"
      | "cancelled"
      | "pending_closure"
      | "closed";
    display_status_label: string;
    expected_days: null;
    expected_timeline: null;
    id: number;
    message: string;
    status: "accepted" | "cancelled";
    status_label: string;
    win_percentage: number;
  };
  submit_offer_blocked_reason: null | string;
  client: {
    contact_visible: boolean;
    first_name: string;
    name?: string;
    photo_url: string | null;
    city?: string;
    email?: string;
    phone?: string;
  };
  documents: {
    id: number;
    name: string;
    url: string;
    size_bytes: number;
  }[];
};

export type Filters = {
  my_specialization_ids: number[];
  specializations: { id: number; name: string }[];
  urgencies: { label: string; value: string }[];
  emirates: string[];
  sorts: { label: string; value: string }[];
};

export const offerFormSchema = (t: T) =>
  z.object({
    win_percentage: z
      .number(t("WinPercentage.Required"))
      .int(t("WinPercentage.Integer"))
      .min(1, t("WinPercentage.Required")),
    amount: z
      .number(t("ProposedPrice.Required"))
      .int(t("ProposedPrice.Integer"))
      .min(1, t("ProposedPrice.Required")),
    message: z
      .string()
      .trim()
      .min(1, t("Message.Required"))
      .min(20, t("Message.Min")),
  });

export type OfferFormData = z.infer<ReturnType<typeof offerFormSchema>>;
