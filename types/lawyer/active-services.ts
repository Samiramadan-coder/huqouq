export type Counts = {
  all: number;
  completed: number;
  delivered: number;
  in_progress: number;
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
  can: {
    add_files: boolean;
    deliver: boolean;
    edit_offer: boolean;
    open_chat: boolean;
    submit_offer: boolean;
  };
  client: {
    first_name: string;
    name: string;
    photo_url: string;
  };
  earnings: {
    fee_percentage: number;
    payout_status: string;
    payout_status_label: string;
    platform_fee: number;
    total_service_fee: number;
    your_earnings: number;
  };
  my_offer: {
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
};
