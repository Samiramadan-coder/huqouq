import z from "zod";
import { T } from "../shared";

export const availabilitySettingsSchema = (t: T) =>
  z.object({
    types: z.array(z.string()).min(1, t("Fields.ConsultationType.Required")),

    slot_minutes: z.number(),

    buffer_minutes: z.number(),

    price: z
      .number({ error: t("Fields.PricePerConsultation.Required") })
      .min(1, t("Fields.PricePerConsultation.Required")),

    blocked_dates: z.array(z.iso.date()),

    weekly: z.record(
      z.enum(["sun", "mon", "tue", "wed", "thu", "fri", "sat"]),
      z.array(z.object({ from: z.string(), to: z.string() })),
    ),

    // weekly: z.array(
    //   z.object({
    //     day: z.enum([
    //       "monday",
    //       "tuesday",
    //       "wednesday",
    //       "thursday",
    //       "friday",
    //       "saturday",
    //       "sunday",
    //     ]),
    //     is_available: z.boolean(),
    //     slots: z.array(
    //       z.object({
    //         start_time: z.string(),
    //         end_time: z.string(),
    //       }),
    //     ),
    //   }),
    // ),
  });

export type AvailabilitySettings = z.infer<
  ReturnType<typeof availabilitySettingsSchema>
>;

export type Options = {
  buffer_minutes: { value: number; label: string }[];
  days: { key: string; label: string }[];
  price: { min: number; max: number };
  slot_minutes: { value: number; label: string }[];
  time_step_minutes: number;
  types: { value: string; label: string }[];
};

export type Data = {
  active_days: number;
  blocked_dates: string[];
  bookable: false;
  buffer_minutes: number;
  currency: string;
  not_bookable_reason: string;
  price: number;
  published: boolean;
  slot_minutes: number;
  types: string[];
  weekly: Record<
    "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat",
    { from: string; to: string; from_label: string; to_label: string }[]
  >;
};
