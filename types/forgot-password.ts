import z from "zod";
import { T, uaePhoneSchema } from "./shared";

// Forgot Password Schema
export const forgotPasswordSchema = (t: T) =>
  z.object({
    phone: uaePhoneSchema(t("fields.phone.invalid")),
  });

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof forgotPasswordSchema>
>;
