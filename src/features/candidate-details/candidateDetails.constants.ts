import type { CandidateFormData } from './candidateDetails.types';

export const initialCandidateFormData: CandidateFormData = {
  fullName: '',
  email: '',
  roleAppliedFor: '',
  experienceLevel: '',
  skills: '',
};

export const candidateRoleOptions = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Product Manager',
];

export const candidateExperienceOptions = [
  { value: 'Fresher', label: 'Fresher (0 years)' },
  { value: 'Junior', label: 'Junior (1-3 years)' },
  { value: 'Mid-level', label: 'Mid-level (3-6 years)' },
  { value: 'Senior', label: 'Senior (6+ years)' },
];
