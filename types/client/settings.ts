import z from "zod";

import { emailSchema, uaePhoneSchema } from "@/types/shared";

export type AccountField = "name" | "email" | "phone";

// One schema per field so each row validates on its own
export const accountFieldSchemas = {
  name: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters"),
  }),
  email: z.object({
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .pipe(emailSchema("Please enter a valid email")),
  }),
  phone: z.object({
    phone: uaePhoneSchema("Please enter a valid UAE mobile number"),
  }),
} satisfies Record<AccountField, z.ZodType>;

export type AccountFieldFormData = Partial<Record<AccountField, string>>;
