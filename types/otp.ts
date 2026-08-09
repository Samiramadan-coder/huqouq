import z from "zod";
import { T } from "./shared";

export const otpSchema = (t: T) =>
  z.object({
    code: z.string().length(6, t("length")),
  });

export type OtpFormValues = z.infer<ReturnType<typeof otpSchema>>;
