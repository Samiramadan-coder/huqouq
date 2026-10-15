import z from "zod";
import { T } from "../shared";

export const weekdays = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
] as const;

export type Weekday = (typeof weekdays)[number];

const timeSlotSchema = z.object({ from: z.string(), to: z.string() });

export type TimeSlot = z.infer<typeof timeSlotSchema>;

export const availabilitySettingsSchema = (t: T) =>
  z.object({
    types: z.array(z.string()).min(1, t("Fields.ConsultationType.Required")),

    slot_minutes: z.number(),

    buffer_minutes: z.number(),

    price: z
      .number({ error: t("Fields.PricePerConsultation.Required") })
      .min(1, t("Fields.PricePerConsultation.Required")),

    blocked_dates: z.array(z.iso.date()),

    weekly: z.record(z.enum(weekdays), z.array(timeSlotSchema)),
  });

export type AvailabilitySettings = z.infer<
  ReturnType<typeof availabilitySettingsSchema>
>;

export type Options = {
  buffer_minutes: { value: number; label: string }[];
  days: { key: Weekday; label: string }[];
  price: { min: number; max: number };
  slot_minutes: { value: number; label: string }[];
  time_step_minutes: number;
  types: { value: string; label: string }[];
};

export type Data = {
  active_days: number;
  blocked_dates: string[];
  bookable: boolean;
  buffer_minutes: number;
  currency: string;
  not_bookable_reason: string;
  price: number;
  published: boolean;
  slot_minutes: number;
  types: string[];
  weekly: Record<
    Weekday,
    (TimeSlot & { from_label: string; to_label: string })[]
  >;
};

export type AvailabilitySettingsResponse = {
  options: Options;
  data: Data;
};

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

type Client = {
  display_name: string;
  first_name: string;
  id: number;
  photo_url: string;
};

type Payment = {
  amount: number;
  currency: string;
  fee_percentage: number;
  lawyer_amount: number;
  payout_status: string;
  platform_fee: number;
};

export type Consultation = {
  brief: null | string;
  can: Can;
  cancellation: null | string;
  cancelled_at: null | string;
  client: Client;
  created_at: string;
  date: string;
  date_label: string;
  duration_minutes: number;
  ends_at: string;
  id: number;
  is_reviewed: boolean;
  join_call_opens_at: string;
  lawyer: null;
  lawyer_cancel_reason: null | string;
  lawyer_cancelled: boolean;
  lawyer_cancelled_at: null | string;
  payment: Payment;
  reference: string;
  rescheduled: boolean;
  rescheduled_from: null | string;
  review: null | string;
  starts_at: string;
  status: string;
  status_label: string;
  time: string;
  time_label: string;
  type: string;
  type_label: string;
};
