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
  rating: number | null;
  reviews_count: number;
  verified: boolean;
  years_of_experience: number;
  specializations: { id: number; name: string }[];
  available_now: boolean;
  is_favorite: boolean;
  consultation: null | {
    bookable: boolean;
    currency: string;
    duration_minutes: number;
    price: number;
    types: { value: string; label: string }[];
  };
};

export type LawyerDetails = Lawyer & {
  bio: string | null;
  languages: string[];
  website_url: string | null;
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

export type Review = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    name: string;
    photo_url: string | null;
  };
  tags: {
    label: string;
    value: string;
  }[];
};

export type Filters = {
  emirates: string[];
  languages: string[];
  specializations: {
    id: number;
    name: string;
  }[];
  sorts: {
    value: string;
    label: string;
  }[];
  ratings: {
    value: number;
    label: string;
  }[];
  availability: {
    value: string;
    label: string;
  }[];
};
