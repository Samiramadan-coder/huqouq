import z from "zod";
import { T } from "../shared";

export type LegalService = {
  description: string;
  display_status_label: string;
  documents_count: number;
  emirate: string;
  id: number;
  my_offer: null;
  offers_count: number;
  service_type: string;
  service_type_label: string;
  status: "pending-review" | "approved" | "rejected";
  status_label: string;
  submitted_at: string;
  urgency: "urgent" | "very_urgent" | "standard";
  urgency_label: string;
  client: {
    first_name: string;
    photo_url: string;
  };
  can: {
    add_files: boolean;
    deliver: boolean;
    edit_offer: boolean;
    open_chat: boolean;
    submit_offer: boolean;
  };
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
    fee: z.number().min(1, { message: t("fee.required") }),

    delivery_amount: z.number().min(1, {
      message: t("delivery_time.required"),
    }),

    delivery_unit: z.string(),

    message: z
      .string()
      .min(1, {
        message: t("message.required"),
      })
      .max(6000, {
        message: t("message.maxLength"),
      }),
  });

export type OfferFormData = z.infer<ReturnType<typeof offerSchema>>;
