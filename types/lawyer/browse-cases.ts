import z from "zod";
import { T } from "../shared";

export type Case = {
  budget_disclosed: boolean;
  budget_max: number;
  budget_min: number;
  city: string;
  description: string;
  documents_count: number;
  id: number;
  offers_count: number;
  posted_at: string;
  title: string;
  urgency: "urgent" | "standard" | "very_urgent";
  urgency_label: string;
  specialization: { id: number; name: string };
};

export type CaseDetails = Case & {
  documents: {
    id: number;
    name: string;
    url: string;
    size_bytes: number;
  }[];
};

export type Filters = {
  my_specialization_ids: number[];
  specializations: {
    id: number;
    name: string;
  }[];
  urgencies: {
    label: string;
    value: string;
  }[];
  emirates: string[];
  sorts: {
    label: string;
    value: string;
  }[];
};

export const offerFormSchema = (t: T) =>
  z.object({
    amount: z.number().min(1, t("ProposedPrice.Required")),
    message: z.string().min(1, t("Message.Required")).min(20, t("Message.Min")),
  });

export type OfferFormData = z.infer<ReturnType<typeof offerFormSchema>>;
