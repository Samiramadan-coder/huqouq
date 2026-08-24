import { T } from "@/types/shared";
import z from "zod";

export const postCaseShema = (t: T) =>
  z
    .object({
      title: z
        .string()
        .min(1, t("caseTitle.required"))
        .min(2, t("caseTitle.minLength")),
      category: z.string().min(1, t("category.required")),
      description: z
        .string()
        .min(1, t("description.required"))
        .min(2, t("description.minLength"))
        .max(2000, t("description.maxLength")),
      urgency: z.string(),
      budgetMin: z.number().optional(),
      budgetMax: z.number().optional(),
      location: z.string().min(1, t("location.required")),
      document: z.instanceof(File).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.budgetMin && data.budgetMax && data.budgetMin > data.budgetMax) {
        ctx.addIssue({
          code: "custom",
          message: t("budget.budgetMinMax"),
          path: ["budgetMin"],
        });
      }
    });

export type PostCaseFormData = z.infer<ReturnType<typeof postCaseShema>>;
