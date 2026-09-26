export type LegalService = {
  description: string;
  display_status_label: string;
  documents_count: number;
  emirate: string;
  id: number;
  my_offer: null;
  offers_count: number;
  service_type: string;
  service_type_label: string;
  status: "pending-review" | "approved" | "rejected";
  status_label: string;
  submitted_at: string;
  urgency: "urgent" | "very_urgent" | "standard";
  urgency_label: string;
  client: {
    first_name: string;
    photo_url: string;
  };
  can: {
    add_files: boolean;
    deliver: boolean;
    edit_offer: boolean;
    open_chat: boolean;
    submit_offer: boolean;
  };
};
