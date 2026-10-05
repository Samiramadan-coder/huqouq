import z from "zod";
import { emailSchema, T, uaePhoneSchema } from "./shared";

// Sign In With Email Schema
export const signInWithEmailSchema = (t: T) =>
  z.object({
    login: emailSchema(t("fields.email.invalid")),
    password: z
      .string()
      .min(1, t("fields.password.required"))
      .min(8, t("fields.password.min")),
    remember: z.boolean(),
  });

export type SignInWithEmailFormValues = z.infer<
  ReturnType<typeof signInWithEmailSchema>
>;

// Sign In With Phone Schema
export const signInWithPhoneSchema = (t: T) =>
  z.object({
    phone: uaePhoneSchema(t("fields.phone.invalid")),
  });

export type SignInWithPhoneFormValues = z.infer<
  ReturnType<typeof signInWithPhoneSchema>
>;
