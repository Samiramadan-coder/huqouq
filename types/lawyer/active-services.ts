export type Counts = {
  all: number;
  completed: number;
  delivered: number;
  in_progress: number;
};

type Can = {
  add_files: boolean;
  deliver: boolean;
  edit_offer: boolean;
  open_chat: boolean;
  submit_offer: boolean;
};

type Client = {
  first_name: string;
  name: string;
  photo_url: string;
};

type Earnings = {
  fee_percentage: number;
  payout_status: string;
  payout_status_label: string;
  platform_fee: number;
  total_service_fee: number;
  your_earnings: number;
};

type MyOffer = {
  created_at: string;
  delivery_amount: number;
  delivery_time_label: string;
  delivery_unit: string;
  delivery_unit_label: string;
  fee: number;
  id: number;
  message: string;
  outcome: string;
  status: string;
  status_label: string;
  updated_at: string;
};

type Attachment = {
  download_url: string;
  id: number;
  mime_type: string;
  name: string;
  size_bytes: number;
  uploaded_at: string;
};

type TimelineEntry = {
  at: null | string;
  key:
    | "submitted"
    | "approved"
    | "offer_accepted"
    | "payment_secured"
    | "in_progress"
    | "delivered"
    | "client_approved"
    | "payment_released";
  label: string;
  state: "done" | "current" | "upcoming" | "skipped";
};

export type Service = {
  days_remaining: number;
  deadline: string;
  description: string;
  display_status_label: string;
  documents_count: number;
  agreed_fee: number;
  emirate: string;
  id: number;
  last_activity_at: string;
  offers_count: number;
  overdue: boolean;
  service_type: string;
  service_type_label: string;
  start_date: string;
  status: "in_progress" | "delivered" | "completed";
  status_label: string;
  submitted_at: string;
  urgency: string;
  urgency_label: string;
  can: Can;
  client: Client;
  earnings: Earnings;
  my_offer: MyOffer;
};

export type ServiceDetails = Service & {
  attachments: Attachment[];
  timeline: TimelineEntry[];
  deliveries: [];
  revisions: [];
};
