import z from "zod";
import { T } from "./shared";

export const resetPasswordSchema = (t: T) =>
  z
    .object({
      token: z.string(),

      email: z.email(t("fields.email.invalid")),

      password: z
        .string()
        .min(1, t("fields.newPassword.required"))
        .min(8, t("fields.newPassword.min"))
        .regex(/[a-z]/, t("fields.newPassword.lowercase"))
        .regex(/[A-Z]/, t("fields.newPassword.uppercase"))
        .regex(/[0-9]/, t("fields.newPassword.number"))
        .regex(/[!@#$%^&*(),.?":{}|<>]/, t("fields.newPassword.special")),

      password_confirmation: z
        .string()
        .min(1, t("fields.confirmNewPassword.required"))
        .min(8, t("fields.confirmNewPassword.min")),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.password_confirmation) {
        ctx.addIssue({
          code: "custom",
          message: t("fields.confirmNewPassword.match"),
          path: ["password_confirmation"],
        });
      }
    });

export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof resetPasswordSchema>
>;
