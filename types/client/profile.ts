import { T } from "@/types/shared";
import z from "zod";

export const updateProfileSchema = (t: T) =>
  z.object({
    first_name: z
      .string()
      .min(1, t("Fields.FirstName.Required"))
      .min(2, t("Fields.FirstName.Min")),
    last_name: z
      .string()
      .min(1, t("Fields.LastName.Required"))
      .min(2, t("Fields.LastName.Min")),
    email: z.email().min(1, t("Fields.Email.Required")),
    phone: z
      .string()
      .trim()
      .regex(/^5[024568]\d{7}$/, t("Fields.Phone.Invalid")),
    city: z.string().min(1, t("Fields.City.Required")),
  });

export type UpdateProfileFormData = z.infer<
  ReturnType<typeof updateProfileSchema>
>;
