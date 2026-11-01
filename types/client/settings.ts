import z from "zod";

import { emailSchema, T, uaePhoneSchema } from "@/types/shared";

export type AccountField = "name" | "email" | "phone";

// One schema per field so each row validates on its own
export const accountFieldSchemas = (t: T) =>
  ({
    name: z.object({
      name: z
        .string()
        .trim()
        .min(1, t("Fields.Name.Required"))
        .min(2, t("Fields.Name.Min")),
    }),
    email: z.object({
      email: z
        .string()
        .trim()
        .min(1, t("Fields.Email.Required"))
        .pipe(emailSchema(t("Fields.Email.Invalid"))),
    }),
    phone: z.object({
      phone: uaePhoneSchema(t("Fields.Phone.Invalid")),
    }),
  }) satisfies Record<AccountField, z.ZodType>;

export type AccountFieldFormData = Partial<Record<AccountField, string>>;

// Changing Password
const PASSWORD_MIN = 8;

export const changePasswordSchema = (t: T) =>
  z
    .object({
      current_password: z
        .string()
        .min(1, t("Password.Errors.currentRequired")),

      new_password: z
        .string()
        .min(1, t("Password.Errors.newRequired"))
        .min(PASSWORD_MIN, t("Password.Errors.min")),

      new_password_confirmation: z
        .string()
        .min(1, t("Password.Errors.confirmRequired")),
    })
    .superRefine((data, ctx) => {
      if (data.new_password && data.new_password === data.current_password) {
        ctx.addIssue({
          code: "custom",
          path: ["new_password"],
          message: t("Password.Errors.sameAsCurrent"),
        });
      }

      if (
        data.new_password_confirmation &&
        data.new_password !== data.new_password_confirmation
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["new_password_confirmation"],
          message: t("Password.Errors.mismatch"),
        });
      }
    });

export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof changePasswordSchema>
>;
