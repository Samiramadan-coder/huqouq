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
  });

export type AvailabilitySettings = z.infer<
  ReturnType<typeof availabilitySettingsSchema>
>;
