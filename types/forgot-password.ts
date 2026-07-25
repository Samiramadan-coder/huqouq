import z from "zod";
import { T } from "./shared";

// Forgot Password Schema
export const forgotPasswordSchema = (t: T) =>
  z.object({
    email: z.email(t("fields.email.invalid")),
  });

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof forgotPasswordSchema>
>;
