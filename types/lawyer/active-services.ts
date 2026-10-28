export type Counts = {
  all: number;
  completed: number;
  delivered: number;
  in_progress: number;
};

type Can = {
  add_files: boolean;
  deliver: boolean;
  download_files: boolean;
  edit_offer: boolean;
  open_chat: boolean;
  submit_offer: boolean;
};

type Client = {
  contact_visible: boolean;
  email: string | null;
  first_name: string;
  last_name: string;
  name: string;
  phone: string | null;
  photo_url: string | null;
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
  agreed_fee: number;
  can: Can;
  client: Client;
  completed_by: null | "client" | "admin";
  days_remaining: number | null;
  deadline: string | null;
  description: string;
  display_status_label: string;
  documents_count: number;
  earnings: Earnings;
  emirate: string;
  emirate_label: string;
  id: number;
  last_activity_at: string;
  my_offer: MyOffer;
  offers_count: number;
  overdue: boolean;
  review_deadline: string | null;
  service_type: string;
  service_type_label: string;
  start_date: string;
  status: "in_progress" | "delivered" | "completed" | "refunded";
  status_label: string;
  submitted_at: string;
  urgency: "urgent" | "standard" | "very_urgent";
  urgency_label: string;
};

export type Revision = {
  delivery_id: number;
  id: number;
  note: string;
  requested_at: string;
};

export type Delivery = {
  delivered_at: string;
  id: number;
  note: null | string;
  files: {
    download_url: string;
    id: number;
    mime_type: string;
    name: string;
    size_bytes: number;
    uploaded_at: string;
  }[];
};

export type ServiceDetails = Service & {
  attachments: Attachment[];
  timeline: TimelineEntry[];
  deliveries: Delivery[];
  revisions: Revision[];
};
