import z from "zod";
import { T } from "@/types/shared";

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
  status: "none" | "active" | "expired";
};

export type EmergencyLive = {
  can_go_live: boolean;
  is_live: boolean;
  live_until: null | string;
  office_emirate: string;
  office_emirate_label: string;
  reason: string;
  reason_message: string;
  auto_off_options: number[];
  areas: number[];
};

// Go Live Form
export const goLiveSchema = (t: T) =>
  z.object({
    auto_off: z.number().int().positive().nullable(),
    areas: z
      .array(z.number().int().positive())
      .min(1, t("GoLive.selectAtLeastOne")),
  });

export type GoLiveFormValues = z.infer<ReturnType<typeof goLiveSchema>>;

// Body for /api/lawyer/emergency/availability
export type UpdateAvailabilityPayload =
  | { is_live: false }
  | ({ is_live: true; office_emirate: string } & GoLiveFormValues);

// Change Plan Form
export const changePlanSchema = (t: T) =>
  z.object({
    plan: z.enum(
      ["monthly", "quarterly", "yearly"],
      t("ChangePlan.planRequired"),
    ),
  });

export type ChangePlanFormValues = z.infer<ReturnType<typeof changePlanSchema>>;
