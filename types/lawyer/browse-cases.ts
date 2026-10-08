import z from "zod";
import { T } from "../shared";

export type Case = {
  budget_disclosed: boolean;
  budget_max: number | null;
  budget_min: number | null;
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

export type MyOffer = {
  amount: number;
  expected_days: number;
  message: string;
};

export type CaseDetails = Case & {
  // Contact fields are only returned once contact_visible is true
  client: {
    contact_visible: boolean;
    first_name: string;
    photo_url: string | null;
    city?: string;
    email?: string;
    phone?: string;
  };
  documents: {
    id: number;
    name: string;
    url: string;
    size_bytes: number;
  }[];
};

export type Filters = {
  my_specialization_ids: number[];
  specializations: { id: number; name: string }[];
  urgencies: { label: string; value: string }[];
  emirates: string[];
  sorts: { label: string; value: string }[];
};

export const offerFormSchema = (t: T) =>
  z.object({
    expected_days: z
      .number(t("EstimatedTimeline.Required"))
      .int(t("EstimatedTimeline.Integer"))
      .min(1, t("EstimatedTimeline.Required")),
    amount: z
      .number(t("ProposedPrice.Required"))
      .int(t("ProposedPrice.Integer"))
      .min(1, t("ProposedPrice.Required")),
    message: z
      .string()
      .trim()
      .min(1, t("Message.Required"))
      .min(20, t("Message.Min")),
  });

export type OfferFormData = z.infer<ReturnType<typeof offerFormSchema>>;
