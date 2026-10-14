export type AcademicDegree = {
  value: string;
  label: string;
};

export type AccountType = {
  value: string;
  label: string;
};

export type BarDegree = {
  value: string;
  label: string;
};

export type DiallingCode = {
  code: string;
  country: string;
};

export type EducationDegree = {
  value: string;
  label: string;
};

export type Service = {
  name: string;
  id: number;
};

export type Specialization = {
  name: string;
  id: number;
};

export type City = {
  emirate: string;
  cities: string[];
};

export type LegalServiceType = {
  value: string;
  label: string;
};

export type CaseType = "new_case" | "ongoing_case" | "judgment_execution";
export type CourtType = "first_instance" | "appeal" | "cassation";
export type ExecutionType =
  | "new_execution_file"
  | "existing_execution_file"
  | "execution_dispute";

export type ReferenceData = {
  academic_degrees: AcademicDegree[];
  account_types: AccountType[];
  bar_degrees: BarDegree[];
  dialling_codes: DiallingCode[];
  education_degrees: EducationDegree[];
  languages: string[];
  services: Service[];
  specializations: Specialization[];
  cities: City[];
  legal_service_types: LegalServiceType[];
  case_types: {
    value: CaseType;
    label: string;
  }[];
  court_types: {
    value: CourtType;
    label: string;
  }[];
  execution_types: {
    value: ExecutionType;
    label: string;
  }[];
};
