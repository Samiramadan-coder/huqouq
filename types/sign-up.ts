import z from "zod";
import { T } from "./shared";

export const signUpSchema = (t: T) =>
  z
    .object({
      first_name: z
        .string()
        .min(1, t("fields.firstName.required"))
        .min(2, t("fields.firstName.min")),
      last_name: z
        .string()
        .min(1, t("fields.lastName.required"))
        .min(2, t("fields.lastName.min")),
      phone: z
        .string()
        .trim()
        .regex(/^5[024568]\d{7}$/, t("fields.phone.invalid")),
      email: z.email(t("fields.email.invalid")),
      password: z
        .string()
        .min(1, t("fields.password.required"))
        .min(8, t("fields.password.min")),
      password_confirmation: z
        .string()
        .min(1, t("fields.confirmPassword.required"))
        .min(8, t("fields.confirmPassword.min")),
      country: z.string().min(1, t("fields.country.required")),
      city: z.string().min(1, t("fields.city.required")),
      terms_accepted: z.boolean().refine((val) => val === true, {
        message: t("fields.terms.required"),
      }),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.password_confirmation) {
        ctx.addIssue({
          code: "custom",
          message: t("fields.confirmPassword.match"),
          path: ["password_confirmation"],
        });
      }
    });

export type SignUpFormValues = z.infer<ReturnType<typeof signUpSchema>>;
