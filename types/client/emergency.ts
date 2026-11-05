import z from "zod";
import { T } from "@/types/shared";

// Emergency Request Schema
export const emergencyRequestSchema = (t: T) =>
  z.object({
    legal_area_id: z
      .number(t("legalAreaRequired"))
      .int()
      .positive(t("legalAreaRequired")),
    emirate: z.string(t("emirateRequired")).trim().min(1, t("emirateRequired")),
    description: z.string().trim().max(1000).optional(),
    accept_short_call: z.boolean().refine((value) => value === true, {
      message: t("acceptShortCallRequired"),
    }),
  });

export type EmergencyRequestForm = z.infer<
  ReturnType<typeof emergencyRequestSchema>
>;
