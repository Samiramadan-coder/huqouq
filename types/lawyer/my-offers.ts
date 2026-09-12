export type Counts = {
  accepted: number;
  all: number;
  cancelled: number;
  closed: number;
  declined: number;
  in_progress: number;
  pending: number;
  pending_closure: number;
  pending_fees: number;
  withdrawn: number;
};

export type OfferStatus = keyof Counts;

export type Offer = {
  amount: number;
  created_at: string;
  display_status: OfferStatus;
  display_status_label: string;
  id: number;
  message: string;
  status: OfferStatus;
  status_label: string;
  expected_days: number;
  expected_timeline: string;
  case: {
    budget_disclosed: boolean;
    budget_max: number;
    budget_min: number;
    id: number;
    specialization: string;
    status: string;
    status_label: string;
    title: string;
  };
};
