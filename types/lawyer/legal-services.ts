import z from "zod";
import { T } from "../shared";

type Can = {
  add_files: boolean;
  deliver: boolean;
  edit_offer: boolean;
  open_chat: boolean;
  submit_offer: boolean;
};

type Client = {
  first_name: string;
  photo_url: string | null;
  contact_visible: boolean;
};

export type myOffer = {
  created_at: string;
  delivery_amount: number;
  delivery_time_label: string;
  delivery_unit: string;
  delivery_unit_label: string;
  fee: number;
  id: number;
  message: string;
  outcome: string;
  status: "pending" | "accepted" | "rejected";
  status_label: string;
  updated_at: string;
};

export type LegalService = {
  description: string;
  display_status_label: string;
  documents_count: number;
  emirate: string;
  id: number;
  my_offer: myOffer | null;
  offers_count: number;
  service_type: string;
  service_type_label: string;
  status: "pending-review" | "approved" | "rejected";
  status_label: string;
  submitted_at: string;
  urgency: "urgent" | "very_urgent" | "standard";
  urgency_label: string;
  client: Client;
  can: Can;
};

type Attachment = {
  download_url: string;
  id: number;
  mime_type: string;
  name: string;
  size_bytes: number;
  uploaded_at: string;
};

export type LegalServiceDetails = LegalService & {
  attachments: Attachment[];
};

export const offerSchema = (t: T) =>
  z.object({
    fee: z
      .number(t("fee.required"))
      .int(t("fee.integer"))
      .min(1, { message: t("fee.required") }),

    delivery_amount: z
      .number(t("delivery_time.required"))
      .int(t("delivery_time.integer"))
      .min(1, {
        message: t("delivery_time.required"),
      }),

    delivery_unit: z.string(),

    message: z
      .string()
      .trim()
      .min(1, {
        message: t("message.required"),
      })
      .min(10, {
        message: t("message.minLength"),
      })
      .max(6000, {
        message: t("message.maxLength"),
      }),
  });

export type OfferFormData = z.infer<ReturnType<typeof offerSchema>>;

export type Filters = {
  service_types: { label: string; value: string }[];
  urgencies: { label: string; value: string }[];
  emirates: string[];
  sorts: { label: string; value: string }[];
};
