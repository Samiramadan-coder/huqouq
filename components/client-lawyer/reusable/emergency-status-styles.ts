import {
  Ban,
  Flag,
  Search,
  CircleX,
  PhoneOff,
  Briefcase,
  PhoneCall,
  CircleCheck,
  PhoneMissed,
} from "lucide-react";

// Every status an emergency request can have (client and lawyer APIs share them)
export type EmergencyStatus =
  | "searching"
  | "in_call"
  | "completed"
  | "converted"
  | "client_no_answer"
  | "dropped"
  | "no_lawyer"
  | "cancelled"
  | "blocked_daily_limit"
  | "under_review";

export type BadgeStyle = { className: string; Icon: typeof CircleCheck };

// Green: went well · Accent: became a case · Blue: in progress
// Amber: needs attention · Red: failed / blocked · Grey: closed by the client
export const emergencyStatusStyles: Record<EmergencyStatus, BadgeStyle> = {
  searching: {
    className: "border-sky-200 bg-sky-50 text-sky-700",
    Icon: Search,
  },
  in_call: {
    className: "border-sky-200 bg-sky-50 text-sky-700",
    Icon: PhoneCall,
  },
  completed: {
    className: "border-green-200 bg-green-50 text-green-700",
    Icon: CircleCheck,
  },
  converted: {
    className: "border-accent/40 bg-accent/10 text-accent",
    Icon: Briefcase,
  },
  client_no_answer: {
    className: "border-amber-200 bg-amber-50 text-amber-700",
    Icon: PhoneMissed,
  },
  under_review: {
    className: "border-amber-200 bg-amber-50 text-amber-700",
    Icon: Flag,
  },
  dropped: {
    className: "border-red-200 bg-red-50 text-red-700",
    Icon: PhoneOff,
  },
  no_lawyer: {
    className: "border-red-200 bg-red-50 text-red-700",
    Icon: CircleX,
  },
  blocked_daily_limit: {
    className: "border-red-200 bg-red-50 text-red-700",
    Icon: Ban,
  },
  cancelled: {
    className: "border-secondary bg-secondary/40 text-primary/50",
    Icon: CircleX,
  },
};

// Unknown statuses (new on the backend) fall back to a neutral badge
export const neutralBadgeStyle: BadgeStyle = {
  className: "border-secondary bg-secondary/40 text-primary",
  Icon: CircleCheck,
};
