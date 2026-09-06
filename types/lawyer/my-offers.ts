export type Counts = {
  accepted: number;
  all: number;
  cancelled: number;
  declined: number;
  pending: number;
  withdrawn: number;
};

export type OfferStatus =
  | "all"
  | "pending"
  | "accepted"
  | "cancelled"
  | "declined"
  | "withdrawn";

export type Offer = {
  amount: number;
  created_at: string;
  display_status: OfferStatus;
  display_status_label: string;
  id: number;
  message: string;
  status: OfferStatus;
  status_label: string;
  case: {
    id: number;
    specialization: string;
    status: string;
    status_label: string;
    title: string;
  };
};
