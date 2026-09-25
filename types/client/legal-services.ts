import z from "zod";
import { T } from "@/types/shared";

export const postLegalServiceShema = (t: T) =>
  z.object({
    service_type: z.string().min(1, t("type.required")),
    description: z
      .string()
      .min(1, t("description.required"))
      .min(2, t("description.minLength"))
      .max(2000, t("description.maxLength")),
    urgency: z.string(),
    emirate: z.string().min(1, t("location.required")),
    documents: z
      .array(z.instanceof(File).or(z.string()))
      .min(1, t("documents.required")),
  });

export type PostLegalServiceFormData = z.infer<
  ReturnType<typeof postLegalServiceShema>
>;

type Attachment = {
  download_url: string;
  id: number;
  mime_type: string;
  name: string;
  size_bytes: number;
  uploaded_at: string;
};

type TimelineEvent = {
  at: string | null;
  key:
    | "submitted"
    | "approved"
    | "offer_accepted"
    | "payment_secured"
    | "in_progress"
    | "delivered"
    | "completed";
  label: string;
  state: string;
};

export type LegalServiceDetails = {
  accepted_offer: null;
  attachments: Attachment[];
  can: {
    approve_delivery: boolean;
    edit: boolean;
    open_chat: boolean;
    pay: boolean;
    rate: boolean;
    request_revision: boolean;
  };
  created_at: string;
  deadline: string | null;
  deliveries: [];
  description: string;
  display_status: string;
  display_status_label: string;
  emirate: string;
  has_offers: boolean;
  hired_lawyer: null;
  id: number;
  latest_delivery: null;
  offers_count: number;
  payment: null;
  rejection_reason: null | string;
  review: null;
  reviewed_at: null | string;
  service_type: string;
  service_type_label: string;
  status: string;
  status_label: "pending_review";
  submitted_at: string;
  urgency: "standard" | "urgent" | "very_urgent";
  urgency_label: string;
  timeline: TimelineEvent[];
};
