export type PlanId = "monthly" | "quarterly" | "yearly";

export type Plan = {
  id: PlanId;
  label: string;
  months: number;
  price: number;
};

export type Stats = {
  accepted: number;
  avg_response_seconds: null | number;
  converted: number;
  declined: number;
  missed: number;
  priority: number;
  received: number;
};

export type EmergencyMemberShip = {
  auto_renew: boolean;
  billing: [];
  card: null;
  free_during_launch: boolean;
  grace_days_left: null;
  is_launch_free: boolean;
  launch_end: null;
  next_charge: null;
  next_plan: null;
  paused_until: null;
  plan: null | PlanId;
  plans: Plan[];
  renews_at: null | string;
  started_at: null | string;
  stats: Stats;
  // "none" when the lawyer is not a member; other values come from the API
  status: "none" | "active" | "cancelled" | (string & {});
};
