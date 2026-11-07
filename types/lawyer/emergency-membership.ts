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

export type PaymentCard = {
  brand: string;
  last4: string;
};

export type Billing = {
  card: null | PaymentCard;
  amount: number;
  created_at: string;
  failure_reason: null | string;
  id: number;
  method: string;
  paid_at: string;
  period_end: string;
  period_start: string;
  plan: Plan;
  receipt_number: string;
  refunded_amount: number;
  status: "paid" | "failed" | "refunded";
  vat_amount: number;
  vat_percentage: number;
};

export type EmergencyMemberShip = {
  auto_renew: boolean;
  billing: Billing[];
  card: null | (PaymentCard & { exp: string });
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
  status: "none" | "active" | "expired" | "cancelled";
};

export type EmergencyLive = {
  can_go_live: boolean;
  is_live: boolean;
  live_until: null | string;
  office_emirate: string;
  office_emirate_label: string;
  reason: null | "not_approved" | "needs_office_emirate";
  reason_message: string;
  auto_off_options: number[];
  areas: number[];
};

// Go Live Form
export const goLiveSchema = (t: T) =>
  z.object({
    auto_off: z.number().int().positive().nullable(),
    // snake_case emirate key, e.g. "abu_dhabi"
    office_emirate: z
      .string(t("GoLive.emirateRequired"))
      .trim()
      .min(1, t("GoLive.emirateRequired")),
    areas: z
      .array(z.number().int().positive())
      .min(1, t("GoLive.selectAtLeastOne")),
  });

export type GoLiveFormValues = z.infer<ReturnType<typeof goLiveSchema>>;

// Body for /api/lawyer/emergency/availability
export type UpdateAvailabilityPayload =
  | { is_live: false }
  | ({ is_live: true } & GoLiveFormValues);

// Change Plan Form
export const changePlanSchema = (t: T) =>
  z.object({
    plan: z.enum(
      ["monthly", "quarterly", "yearly"],
      t("ChangePlan.planRequired"),
    ),
  });

export type ChangePlanFormValues = z.infer<ReturnType<typeof changePlanSchema>>;

// Subscribe (paid checkout) Form
// Expiry "MM/YY" that is not in the past
function isValidExpiry(value: string) {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();
  return (
    year > now.getFullYear() ||
    (year === now.getFullYear() && month >= now.getMonth() + 1)
  );
}

// Card details, shared by checkout and "update payment method"
export const cardSchema = (t: T) =>
  z.object({
    name: z.string().trim().min(2, t("Subscribe.nameRequired")),
    number: z
      .string()
      .refine(
        (value) => /^\d{13,19}$/.test(value.replace(/\s/g, "")),
        t("Subscribe.numberInvalid"),
      ),
    exp: z.string().refine(isValidExpiry, t("Subscribe.expInvalid")),
    cvc: z.string().regex(/^\d{3,4}$/, t("Subscribe.cvcInvalid")),
  });

export type CardValues = z.infer<ReturnType<typeof cardSchema>>;

export const subscribeSchema = (t: T) =>
  z.object({
    card: cardSchema(t),
    auto_renew: z.boolean(),
  });

export type SubscribeFormValues = z.infer<ReturnType<typeof subscribeSchema>>;

// Update Card Form
export const updateCardSchema = (t: T) => z.object({ card: cardSchema(t) });

export type UpdateCardFormValues = z.infer<ReturnType<typeof updateCardSchema>>;
