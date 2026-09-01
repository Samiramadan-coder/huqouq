import { T } from "@/types/shared";
import z from "zod";

export const postCaseShema = (t: T) =>
  z
    .object({
      title: z
        .string()
        .min(1, t("caseTitle.required"))
        .min(2, t("caseTitle.minLength")),
      specialization_id: z.string().min(1, t("category.required")),
      description: z
        .string()
        .min(1, t("description.required"))
        .min(2, t("description.minLength"))
        .max(2000, t("description.maxLength")),
      urgency: z.string(),
      budget_min: z.number().optional(),
      budget_max: z.number().optional(),
      city: z.string().min(1, t("location.required")),
      documents: z
        .array(z.instanceof(File).or(z.string()))
        .min(1, t("documents.required")),
    })
    .superRefine((data, ctx) => {
      if (
        data.budget_min &&
        data.budget_max &&
        data.budget_min > data.budget_max
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("budget.budgetMinMax"),
          path: ["budget_min"],
        });
      }
    });

export type PostCaseFormData = z.infer<ReturnType<typeof postCaseShema>>;
