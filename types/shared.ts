import { Education, Experience, ProfileStatus } from "./lawyer/profile";

export type T = (key: string) => string;

export type GuestType = "client" | "lawyer";

export type AuthFormActionsResponse<T> =
  | {
      success: true;
      token?: string;
      user?: User;
      message?: string;
    }
  | {
      success: false;
      errors?: Partial<Record<keyof T, string>>;
    };

// Shared types between client and server
export type User = {
  city: string;
  country: string;
  created_at: string;
  email: string;
  email_verified: boolean;
  first_name: string;
  id: number;
  last_name: string;
  lawyer_profile: null | {
    academic_degree: string | null;
    academic_degree_label: string | null;
    account_type: string | null;
    bar_certificate_url: string | null;
    bar_degree: string | null;
    bar_degree_label: string | null;
    bar_number: string | null;
    bio: string | null;
    completion_percentage: number;
    specializations: {
      id: number;
      name: string;
    }[];
    services: {
      id: number;
      name: string;
    }[];
    office_name: string | null;
    profile_status: ProfileStatus;
    rejection_reason: string | null;
    submitted_at: string | null;
    website_url: string | null;
    years_of_experience: number | null;
    languages: string[];
    education: Education[];
    experience: Experience[];
  };
  name: string;
  phone: string;
  phone_verified: boolean;
  photo_url: string | null;
  role: GuestType;
  status: "unverified" | "pending_approval" | "active";
};
