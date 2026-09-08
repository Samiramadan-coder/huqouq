import { CaseOffer, CaseStatus } from "../client/cases";

type Client = {
  first_name: string;
  id: number;
  name: string;
  photo_url: string;
};

type Specialization = {
  id: number;
  name: string;
};

export type CaseDetails = {
  accepted_offer: CaseOffer;
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
  client: Client;
  specialization: Specialization;
};
