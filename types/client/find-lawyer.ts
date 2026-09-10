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
