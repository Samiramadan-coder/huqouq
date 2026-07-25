import z from "zod";
import { T } from "./shared";

export const signInWithEmailSchema = (t: T) =>
  z.object({
    email: z.email(t("fields.email.invalid")),
    password: z
      .string()
      .min(1, t("fields.password.required"))
      .min(8, t("fields.password.min")),
  });

export type SignInWithEmailFormValues = z.infer<
  ReturnType<typeof signInWithEmailSchema>
>;
