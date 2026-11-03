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

// Profile Photo
export const PHOTO_MAX_SIZE = 2 * 1024 * 1024; // 2MB

export const profilePhotoSchema = (t: T) =>
  z.object({
    photo: z
      .custom<File>(
        (value) => value instanceof File,
        t("Photo.Errors.required"),
      )
      .refine((file) => file.type.startsWith("image/"), t("Photo.Errors.type"))
      .refine((file) => file.size <= PHOTO_MAX_SIZE, t("Photo.Errors.maxSize")),
  });

export type ProfilePhotoFormValues = z.infer<
  ReturnType<typeof profilePhotoSchema>
>;

// Changing Password
const PASSWORD_MIN = 8;

export const changePasswordSchema = (t: T) =>
  z
    .object({
      current_password: z.string().min(1, t("Password.Errors.currentRequired")),
      password: z
        .string()
        .min(1, t("Password.Errors.newRequired"))
        .min(PASSWORD_MIN, t("Password.Errors.min"))
        .regex(/[a-z]/, t("Password.Errors.lowercase"))
        .regex(/[A-Z]/, t("Password.Errors.uppercase"))
        .regex(/[0-9]/, t("Password.Errors.number"))
        .regex(/[!@#$%^&*(),.?":{}|<>]/, t("Password.Errors.special")),
      password_confirmation: z
        .string()
        .min(1, t("Password.Errors.confirmRequired")),
    })
    .superRefine((data, ctx) => {
      if (data.password && data.password === data.current_password) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: t("Password.Errors.sameAsCurrent"),
        });
      }

      if (
        data.password_confirmation &&
        data.password !== data.password_confirmation
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["password_confirmation"],
          message: t("Password.Errors.mismatch"),
        });
      }
    });

export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof changePasswordSchema>
>;

// Client DangerZone Body
export type WhyDeleteReason = {
  value:
    | "no_longer_needed"
    | "privacy"
    | "found_alternative"
    | "too_expensive"
    | "technical"
    | "other";
  label: string;
};

export type ClientDangerZone = {
  blockers: {
    code: "hired_case" | "active_legal_service" | "upcoming_consultation";
    label: string;
    count: number;
  }[];
  can_delete: boolean;
  reasons: WhyDeleteReason[];
};

// Delete account confirmation
export const DELETE_REASONS = [
  "no_longer_needed",
  "privacy",
  "found_alternative",
  "too_expensive",
  "technical",
  "other",
] as const satisfies readonly WhyDeleteReason["value"][];

export const REASON_TEXT_MAX = 500;

export const deleteAccountSchema = (t: T) =>
  z
    .object({
      reason: z.enum(DELETE_REASONS).optional(),
      reason_text: z
        .string()
        .trim()
        .max(REASON_TEXT_MAX, t("Dialog.Confirm.Errors.reasonTextMax"))
        .optional(),
      code: z.string().trim().min(1, t("Dialog.Confirm.Errors.codeRequired")),
    })
    // The API requires reason_text when the reason is "other"
    .superRefine((data, ctx) => {
      if (data.reason === "other" && !data.reason_text) {
        ctx.addIssue({
          code: "custom",
          path: ["reason_text"],
          message: t("Dialog.Confirm.Errors.reasonTextRequired"),
        });
      }
    });

export type DeleteAccountFormValues = z.infer<
  ReturnType<typeof deleteAccountSchema>
>;
