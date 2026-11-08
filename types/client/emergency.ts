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

type Area = {
  id: number;
  name: string;
};

type Lawyer = {
  based_in: string;
  experience_range: string;
  legal_area: string;
  verified: boolean;
};

export type Emergency = {
  id: number;
  reference: string;
  status:
    | "no_lawyer"
    | "in_call"
    | "dropped"
    | "cancelled"
    | "completed"
    | "under_review";
  status_label: string;
  created_at: string;
  server_time: string;
  legal_area: Area;
  emirate: string;
  emirate_label: string;
  description: string;
  call: Call;
  elapsed_seconds: number;
  all_busy: boolean;
  lawyers_tried: number;
  matched_lawyer: null | Lawyer;
  rating: null | number;
  rating_comment: null | string;
  continue_answer: null | string;
  case_id: null | number;
  conversion_expires_at: null | string;
  can: Can;
  report: null;
};
