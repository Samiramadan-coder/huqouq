export type Lawyer = {
  account_type: string;
  account_type_label: string;
  city: string;
  first_name: string;
  id: number;
  last_name: string;
  name: string;
  office_name: string | null;
  photo_url: string | null;
  rating: number;
  reviews_count: number;
  verified: boolean;
  years_of_experience: number;
  specializations: { id: number; name: string }[];
};

export type LawyerDetails = {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  photo_url: string | null;
  city: string;
  verified: boolean;
  account_type: string;
  account_type_label: string;
  office_name: string | null;
  years_of_experience: number;
  rating: number;
  reviews_count: number;
  bio: string;
  languages: string[];
  website_url: string;
  specializations: {
    id: number;
    name: string;
  }[];
  services: {
    id: number;
    name: string;
  }[];
  education: {
    degree: string;
    degree_label: string;
    university: string;
    graduation_year: number;
  }[];
  experience: {
    title: string;
    organization: string;
    start_month: number;
    start_year: number;
    is_current: boolean;
    end_month: number | null;
    end_year: number | null;
  }[];
};
