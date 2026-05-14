import type { CandidateFieldName, CandidateFormData, CandidateFormErrors } from './candidateDetails.types';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[a-zA-Z\s\-']+$/;

export function validateCandidateField(name: CandidateFieldName, value: string) {
  const trimmedValue = value.trim();

  if (name === 'fullName') {
    if (!trimmedValue) return 'Full name is required.';
    if (trimmedValue.length < 2) return 'Full name must be at least 2 characters long.';
    if (trimmedValue.length > 100) return 'Full name must be no more than 100 characters long.';
    if (!namePattern.test(trimmedValue)) return 'Full name can only contain letters, spaces, hyphens, and apostrophes.';
  }

  if (name === 'email') {
    if (!trimmedValue) return 'Email address is required.';
    if (trimmedValue.length < 5) return 'Email address must be at least 5 characters long.';
    if (trimmedValue.length > 254) return 'Email address must be no more than 254 characters long.';
    if (!emailPattern.test(trimmedValue)) return 'Enter a valid email address.';
  }

  if (name === 'roleAppliedFor' && !value) {
    return 'Select the role you are applying for.';
  }

  if (name === 'experienceLevel' && !value) {
    return 'Select your experience level.';
  }

  if (name === 'skills') {
    if (!trimmedValue) return 'Add the skills you want to be interviewed on.';
    if (trimmedValue.length < 3) return 'Enter at least one skill or technology.';
  }

  return '';
}

export function validateCandidateForm(formData: CandidateFormData) {
  return (Object.keys(formData) as CandidateFieldName[]).reduce<CandidateFormErrors>((errors, fieldName) => {
    const error = validateCandidateField(fieldName, formData[fieldName]);
    if (error) errors[fieldName] = error;
    return errors;
  }, {});
}
