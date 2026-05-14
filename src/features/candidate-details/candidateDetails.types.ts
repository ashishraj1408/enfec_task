export type CandidateFieldName =
  | 'fullName'
  | 'email'
  | 'roleAppliedFor'
  | 'experienceLevel'
  | 'skills';

export type CandidateFormData = Record<CandidateFieldName, string>;

export type CandidateFormErrors = Partial<Record<CandidateFieldName, string>>;

export type CandidateFormTouched = Partial<Record<CandidateFieldName, boolean>>;

export type CandidateStoredData = Partial<CandidateFormData> & {
  resumeName?: string;
};
