import z from "zod";
import { T } from "@/types/shared";

// Emergency Request Schema
export const emergencyRequestSchema = (t: T) =>
  z.object({
    legal_area_id: z
      .number(t("legalAreaRequired"))
      .int()
      .positive(t("legalAreaRequired")),
    emirate: z.string(t("emirateRequired")).trim().min(1, t("emirateRequired")),
    description: z.string().trim().max(1000).optional(),
    accept_short_call: z.boolean().refine((value) => value === true, {
      message: t("acceptShortCallRequired"),
    }),
  });

export type EmergencyRequestForm = z.infer<
  ReturnType<typeof emergencyRequestSchema>
>;

type Call = {
  call_ends_at: null | string;
  call_seconds: null | number;
  connected_at: null | string;
  end_reason: null | string;
  ended_at: null | string;
  ended_by: null | string;
};

type Can = {
  cancel: boolean;
  continue: boolean;
  join_call: boolean;
  keep_waiting: boolean;
  rate: boolean;
  report: boolean;
  start_case: boolean;
};

export type Emergency = {
  all_busy: boolean;
  call: Call;
  can: Can;
  case_id: null | number;
  continue_answer: null | string;
  conversion_expires_at: null | string;
  created_at: string;
  description: string;
  elapsed_seconds: number;
  emirate: string;
  emirate_label: string;
  id: number;
  lawyers_tried: number;
  legal_area: { id: number; name: string };
  // Assumed shape; a null name means the lawyer stays anonymous
  matched_lawyer: null | {
    id: number;
    name: null | string;
    photo_url?: null | string;
  };
  rating: null | number;
  rating_comment: null | string;
  reference: string;
  report: null;
  server_time: string;
  status: "no_lawyer" | "cancelled" | "completed" | "under_review";
  status_label: string;
};
