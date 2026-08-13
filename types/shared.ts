export type T = (key: string) => string;

export type GuestType = "client" | "lawyer";

export type AuthFormActionsResponse<T> =
  | {
      success: true;
      token?: string;
      email_verified?: boolean;
      phone_verified?: boolean;
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
  lawyer_profile: null;
  name: string;
  phone: string;
  phone_verified: boolean;
  photo_url: string | null;
  role: GuestType;
  status: "active" | "inactive";
};
