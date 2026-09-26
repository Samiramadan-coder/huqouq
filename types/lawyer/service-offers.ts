export type Counts = {
  accepted: number;
  all: number;
  pending: number;
  rejected: number;
};

export type Offer = {
  created_at: string;
  delivery_amount: number;
  delivery_time_label: string;
  delivery_unit: string;
  delivery_unit_label: string;
  fee: number;
  id: number;
  message: string;
  outcome: string;
  status: "pending" | "accepted" | "rejected";
  status_label: string;
  updated_at: string;
  request: {
    id: number;
    service_type: string;
    service_type_label: string;
    status: string;
    client_first_name: string;
  };
};
