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
    academic_degree: string;
    academic_degree_label: string;
    account_type: string;
    bar_certificate_url: string;
    bar_degree: string;
    bar_degree_label: string;
    bar_number: string;
    bio: string;
    completion_percentage: number;
    specializations: { id: number; name: string }[];
    services: { id: number; name: string }[];
    office_name: string;
    profile_status: "in_review";
    rejection_reason: string | null;
    submitted_at: string;
    website_url: string;
    years_of_experience: number;
    languages: string[];
    education: {
      certificate_path: string | null;
      certificate_url: string | null;
      degree: "bachelors";
      description: string;
      graduation_month: number;
      graduation_year: number;
      university: string;
    }[];
    experience: {
      certificate_path: null | string;
      certificate_url: null | string;
      description: string;
      end_month: number | null;
      end_year: number | null;
      is_current: boolean;
      organization: string;
      start_month: number;
      start_year: number;
      title: string;
    }[];
  };
  name: string;
  phone: string;
  phone_verified: boolean;
  photo_url: string | null;
  role: GuestType;
  status: "active" | "inactive";
};
