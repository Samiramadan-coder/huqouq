import z from "zod";
import { T } from "../shared";
import { CaseOffer, CaseStatus } from "../client/cases";

export type CaseDetails = {
  posted_at: string;
  accepted_offer: null | CaseOffer;
  budget_disclosed: boolean;
  budget_max: number;
  budget_min: number;
  can_close: boolean;
  can_edit: boolean;
  chat_unlocked: boolean;
  city: string;
  closed_at: string | null;
  closed_by: string | null;
  closing_note: string | null;
  closure_requested_at: string | null;
  created_at: string;
  description: string;
  display_status: CaseStatus;
  display_status_label: string;
  documents_count: number;
  fee_paid_at: string | null;
  has_offers: boolean;
  hired_at: string | null;
  id: number;
  offers_count: number;
  rejection_reason: string | null;
  reviewed_at: string | null;
  status: CaseStatus;
  status_label: string;
  title: string;
  urgency: "urgent" | "standard" | "very_urgent";
  urgency_label: string;
  client: null | {
    first_name: string;
    id: number;
    name: string;
    photo_url: string;
  };
  specialization: {
    id: number;
    name: string;
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
  specializations: {
    id: number;
    name: string;
  }[];
  urgencies: {
    label: string;
    value: string;
  }[];
  emirates: string[];
  sorts: {
    label: string;
    value: string;
  }[];
};

export const offerFormSchema = (t: T) =>
  z.object({
    amount: z.number().min(1, t("ProposedPrice.Required")),
    message: z.string().min(1, t("Message.Required")).min(20, t("Message.Min")),
  });

export type OfferFormData = z.infer<ReturnType<typeof offerFormSchema>>;
