import z from "zod";
import { T } from "../shared";

export const availabilitySettingsSchema = (t: T) =>
  z.object({
    slot_duration: z.number(),

    consultation_type: z
      .array(z.enum(["video", "voice"]))
      .min(1, t("Fields.ConsultationType.Required")),

    price_per_consultation: z
      .number({ error: t("Fields.PricePerConsultation.Required") })
      .min(1, t("Fields.PricePerConsultation.Required")),

    buffer_time_between_sessions: z.number(),

    // ISO dates ("YYYY-MM-DD") as produced by the date input
    blocked_dates: z.array(z.iso.date()),

    weekly_recurring_availability: z.array(
      z.object({
        day: z.enum([
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ]),
        start_time: z.string(),
        end_time: z.string(),
      }),
    ),
  });

export type AvailabilitySettings = z.infer<
  ReturnType<typeof availabilitySettingsSchema>
>;
