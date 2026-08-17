import z from "zod";
import { T } from "./shared";

// Sign In With Email Schema
export const signInWithEmailSchema = (t: T) =>
  z.object({
    login: z.email(t("fields.email.invalid")),
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
    phone: z
      .string()
      .trim()
      .regex(/^5[024568]\d{7}$/, t("fields.phone.invalid")),
    // password: z
    //   .string()
    //   .min(1, t("fields.password.required"))
    //   .min(8, t("fields.password.min")),
    // remember: z.boolean(),
  });

export type SignInWithPhoneFormValues = z.infer<
  ReturnType<typeof signInWithPhoneSchema>
>;
