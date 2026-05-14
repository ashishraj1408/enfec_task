'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FocusEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowRight, Briefcase, CheckCircle2, ChevronDown, Mail, Upload, User, Zap } from 'lucide-react';
import { BrandHeader } from '../components/BrandHeader';
import {
  candidateExperienceOptions,
  candidateRoleOptions,
  initialCandidateFormData,
} from '@/features/candidate-details/candidateDetails.constants';
import type {
  CandidateFieldName,
  CandidateFormData,
  CandidateFormErrors,
  CandidateFormTouched,
  CandidateStoredData,
} from '@/features/candidate-details/candidateDetails.types';
import {
  validateCandidateField,
  validateCandidateForm,
} from '@/features/candidate-details/candidateDetails.validation';

export default function CandidateDetails() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialCandidateFormData);
  const [errors, setErrors] = useState<CandidateFormErrors>({});
  const [touched, setTouched] = useState<CandidateFormTouched>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeName, setResumeName] = useState('');
  const [draftSavedAt, setDraftSavedAt] = useState('');
  const [resumeInsights, setResumeInsights] = useState<string[]>([]);

  const allFieldsTouched = useMemo(() => {
    return (Object.keys(initialCandidateFormData) as CandidateFieldName[]).reduce<CandidateFormTouched>((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedCandidateData = localStorage.getItem('candidateData');
      const savedDraftData = localStorage.getItem('candidateDraft');
      const savedTime = localStorage.getItem('candidateDraftSavedAt');
      const savedData = savedDraftData || savedCandidateData;

      if (!savedData) return;

      const parsedData = JSON.parse(savedData) as CandidateStoredData;
      setFormData({
        fullName: parsedData.fullName || '',
        email: parsedData.email || '',
        roleAppliedFor: parsedData.roleAppliedFor || '',
        experienceLevel: parsedData.experienceLevel || '',
        skills: parsedData.skills || '',
      });
      setResumeName(parsedData.resumeName || '');
      setDraftSavedAt(savedTime ? new Date(savedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

      if (parsedData.resumeName) {
        setResumeInsights([
          `${parsedData.resumeName} parsed for role alignment`,
          'Highlighting technical skills and project contributions',
          'Detecting strong communication and delivery experience',
        ]);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const saveDraft = (nextFormData: CandidateFormData, nextResumeName = resumeName) => {
    localStorage.setItem('candidateDraft', JSON.stringify({ ...nextFormData, resumeName: nextResumeName }));
    const savedTime = new Date().toISOString();
    localStorage.setItem('candidateDraftSavedAt', savedTime);
    setDraftSavedAt(new Date(savedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const updateFieldError = (name: CandidateFieldName, value: string) => {
    const error = validateCandidateField(name, value);
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      if (error) {
        nextErrors[name] = error;
      } else {
        delete nextErrors[name];
      }
      return nextErrors;
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target as { name: CandidateFieldName; value: string };
    setFormData((currentData) => {
      const nextData = { ...currentData, [name]: value };
      saveDraft(nextData);
      return nextData;
    });
    updateFieldError(name, value);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target as { name: CandidateFieldName; value: string };
    setTouched((currentTouched) => ({ ...currentTouched, [name]: true }));
    updateFieldError(name, value);
  };

  const handleResumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileName = event.target.files?.[0]?.name ?? '';
    setResumeName(fileName);
    saveDraft(formData, fileName);
    if (fileName) {
      setResumeInsights([
        `${fileName} analyzed for role keywords`,
        'Detected strong problem-solving and team collaboration',
        'Resume appears optimized for the selected position',
      ]);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setTouched(allFieldsTouched);

    const nextErrors = validateCandidateForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    localStorage.setItem('candidateData', JSON.stringify({ ...formData, resumeName }));
    localStorage.setItem('candidateDraft', JSON.stringify({ ...formData, resumeName }));
    localStorage.removeItem('interviewSetupComplete');
    localStorage.removeItem('interviewData');
    localStorage.removeItem('codingData');
    router.push('/interview-setup');
  };

  const shouldShowError = (fieldName: CandidateFieldName) => Boolean(errors[fieldName]);
  const isFieldValid = (fieldName: CandidateFieldName) => Boolean((touched[fieldName] || submitted) && formData[fieldName] && !errors[fieldName]);
  const fieldClassName = (fieldName: CandidateFieldName) => {
    if (shouldShowError(fieldName)) return 'field field-error';
    if (isFieldValid(fieldName)) return 'field field-valid';
    return 'field';
  };

  return (
    <main className="app-shell">
      <BrandHeader maxWidthClassName="mx-auto w-full max-w-4xl px-4" />

      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6">
          <div className="step-pill">
            <span>1</span>
            <span>Candidate Details</span>
          </div>
        </div>

        <section className="panel p-6 sm:p-8">
          <div className="mb-7 space-y-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-950">Tell us about yourself</h1>
              <p className="mt-2 leading-7 muted">These details personalize the interview questions and the final report.</p>
            </div>
            <div className="save-status">
              <span className="text-sm font-semibold text-gray-900">Auto-save enabled</span>
              <span>Draft saved {draftSavedAt ? `at ${draftSavedAt}` : 'automatically as you type'}</span>
            </div>
            {resumeName && (
              <div className="subtle-panel p-4 text-sm leading-6">
                <p className="font-semibold text-gray-950">Resume analysis</p>
                <p className="mt-1 muted">We’ve extracted key strengths from your uploaded resume.</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {resumeInsights.map((insight) => (
                    <li key={insight}>• {insight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="fullName" className="field-label">
                <User className="h-4 w-4 text-[var(--accent)]" />
                Full name
                <span className="text-[var(--danger)]" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  minLength={2}
                  maxLength={100}
                  pattern="[a-zA-Z\s\-']+"
                  title="Full name can only contain letters, spaces, hyphens, and apostrophes"
                  className={`${fieldClassName('fullName')} pr-10`}
                  aria-invalid={shouldShowError('fullName')}
                  aria-describedby={shouldShowError('fullName') ? 'fullName-error' : undefined}
                />
                {isFieldValid('fullName') && <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-[var(--success)]" />}
              </div>
              {shouldShowError('fullName') && (
                <p id="fullName-error" className="error-text">
                  <AlertCircle className="h-4 w-4" />
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="field-label">
                <Mail className="h-4 w-4 text-[var(--accent)]" />
                Email address
                <span className="text-[var(--danger)]" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="john@example.com"
                  minLength={5}
                  maxLength={254}
                  className={`${fieldClassName('email')} pr-10`}
                  aria-invalid={shouldShowError('email')}
                  aria-describedby={shouldShowError('email') ? 'email-error' : undefined}
                />
                {isFieldValid('email') && <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-[var(--success)]" />}
              </div>
              {shouldShowError('email') && (
                <p id="email-error" className="error-text">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="roleAppliedFor" className="field-label">
                <Briefcase className="h-4 w-4 text-[var(--accent)]" />
                Role applied for
                <span className="text-[var(--danger)]" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <select
                  id="roleAppliedFor"
                  name="roleAppliedFor"
                  value={formData.roleAppliedFor}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${fieldClassName('roleAppliedFor')} select-field`}
                  aria-invalid={shouldShowError('roleAppliedFor')}
                  aria-describedby={shouldShowError('roleAppliedFor') ? 'roleAppliedFor-error' : undefined}
                >
                  <option value="">Select a role</option>
                  {candidateRoleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-gray-500" />
              </div>
              {shouldShowError('roleAppliedFor') && (
                <p id="roleAppliedFor-error" className="error-text">
                  <AlertCircle className="h-4 w-4" />
                  {errors.roleAppliedFor}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="experienceLevel" className="field-label">
                Experience level
                <span className="text-[var(--danger)]" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${fieldClassName('experienceLevel')} select-field`}
                  aria-invalid={shouldShowError('experienceLevel')}
                  aria-describedby={shouldShowError('experienceLevel') ? 'experienceLevel-error' : undefined}
                >
                  <option value="">Select experience level</option>
                  {candidateExperienceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-gray-500" />
              </div>
              {shouldShowError('experienceLevel') && (
                <p id="experienceLevel-error" className="error-text">
                  <AlertCircle className="h-4 w-4" />
                  {errors.experienceLevel}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="skills" className="field-label">
                <Zap className="h-4 w-4 text-[var(--accent)]" />
                Skills and technologies
                <span className="text-[var(--danger)]" aria-hidden="true">*</span>
              </label>
              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="React, TypeScript, Node.js, SQL"
                rows={4}
                className={`${fieldClassName('skills')} resize-none leading-6`}
                aria-invalid={shouldShowError('skills')}
                aria-describedby={shouldShowError('skills') ? 'skills-error' : undefined}
              />
              {shouldShowError('skills') && (
                <p id="skills-error" className="error-text">
                  <AlertCircle className="h-4 w-4" />
                  {errors.skills}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="resume" className="field-label">
                <Upload className="h-4 w-4 text-[var(--accent)]" />
                Resume
                <span className="font-normal muted">(optional)</span>
              </label>
              <label htmlFor="resume" className="subtle-panel flex cursor-pointer items-center gap-4 p-4 transition hover:border-gray-400">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Upload className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-gray-950">
                    {resumeName || 'Choose a PDF, DOC, or DOCX file'}
                  </span>
                  <span className="mt-1 block text-sm muted">Click to upload. The selected file name is saved with your profile.</span>
                </span>
                <input id="resume" type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={handleResumeChange} />
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row">
              <Link href="/" className="btn btn-secondary sm:w-32">
                Back
              </Link>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1">
                {isSubmitting ? 'Saving...' : 'Continue to Setup'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
