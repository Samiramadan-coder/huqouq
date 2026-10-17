export type Summary = {
  paid: number;
  ready: number;
  pending: number;
  currency: string;
  total_earned: number;
  transactions: number;
};

export type Counts = {
  all: number;
  consultations: number;
  legal_services: number;
  paid: number;
  pending: number;
  ready: number;
};

export type Earning = {
  amount: number;
  becomes_ready_on: null | string;
  client: { first_name: string; name: string };
  currency: string;
  date: string;
  earned_at: null | string;
  fee_percentage: number;
  gross: number;
  id: string;
  paid_date: null | string;
  paid_reference: null | string;
  payout_id: null | string;
  pending_note: string;
  platform_fee: number;
  service_type: null | string;
  service_type_label: null | string;
  source_id: number;
  status: "ready" | "pending" | "paid";
  status_label: string;
  type: string;
  type_label: string;
};
