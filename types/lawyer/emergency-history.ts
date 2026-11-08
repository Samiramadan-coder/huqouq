import type { EmergencyStatus } from "@/components/client-lawyer/reusable/emergency-status-styles";

export type Emergency = {
  call: {
    call_ends_at: null | string;
    call_seconds: null | number;
    connected_at: null | string;
    end_reason: null | string;
    ended_at: null | string;
    ended_by: null | string;
  };
  can: {
    accept: boolean;
    join_call: boolean;
    record_outcome: boolean;
  };
  case_id: null | number;
  client_first_name: string;
  converted: boolean;
  created_at: string;
  description: string;
  emirate: string;
  emirate_label: string;
  expires_at: string;
  id: number;
  my_result: "pending" | "accepted" | "declined" | "missed";
  note: null | string;
  outcome: null | string;
  outcome_label: null | string;
  reference: string;
  server_time: string;
  legal_area: { id: number; name: string };
  status: EmergencyStatus;
  status_label: string;
};

// Tab counts returned with the requests list
export type Counts = {
  total: number;
  accepted: number;
  declined: number;
  missed: number;
};
