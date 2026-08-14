export type LawyerProfile = {
  completion_percentage: number;
  is_editable: boolean;
  is_ready_to_submit: boolean;
  profile_status: "incomplete" | "complete" | "in_review" | "needs_fix";
  rejection_reason: null | string;
  submitted_at: null | string;
  profile: {
    academic_degree: null;
    account_type: null;
    bar_certificate_path: null;
    bar_certificate_url: null;
    bar_degree: null;
    bar_number: null;
    bio: null;
    educations: [];
    experiences: [];
    languages: [];
    office_name: null;
    service_ids: [];
    specialization_ids: [];
    website_url: null;
    years_of_experience: null;
  };
  sections: {
    is_complete: boolean;
    key:
      | "professional_info"
      | "specializations_services"
      | "languages_bio"
      | "education"
      | "experience"
      | "bar_certificate";
    label: string;
    reason: null | string;
    status: "pending" | "approved" | "rejected";
    weight: number;
  }[];
};
