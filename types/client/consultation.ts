export type Counts = {
  all: number;
  cancelled: number;
  completed: number;
  needs_new_time: number;
  upcoming: number;
};

type Can = {
  cancel: boolean;
  join_call: boolean;
  rate: boolean;
  reschedule: boolean;
};

type Cancellation = {
  policy: string;
  refund_amount: number;
  refundable: boolean;
};

type Lawyer = {
  id: number;
  name: string;
  photo_url: string;
  specializations: string[];
};

type Payment = {
  amount: number;
  currency: string;
  paid_at: string;
  reference: string;
  refund_amount: number | null;
  refunded_at: string | null;
};

export type Consultation = {
  brief: null | string;
  cancelled_at: null | string;
  client: null;
  created_at: string;
  date: string;
  date_label: string;
  duration_minutes: number;
  ends_at: string;
  id: number;
  is_reviewed: boolean;
  join_call_opens_at: string;
  lawyer_cancel_reason: null | string;
  lawyer_cancelled: boolean;
  lawyer_cancelled_at: null | string;
  reference: string;
  rescheduled: boolean;
  rescheduled_from: null | string;
  review: null;
  starts_at: string;
  status: string;
  status_label: string;
  time: string;
  time_label: string;
  type: string;
  type_label: string;
  can: Can;
  cancellation: Cancellation;
  lawyer: Lawyer;
  payment: Payment;
};
