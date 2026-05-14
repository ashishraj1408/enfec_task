'use client';

import { X } from 'lucide-react';

type InterviewInstructionsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function InterviewInstructionsModal({ open, onClose }: InterviewInstructionsModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-panel panel p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">Interview guidance</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-950">Instructions for your session</h2>
          </div>
          <button type="button" onClick={onClose} className="btn btn-quiet p-2" aria-label="Close instructions">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-7 muted">
          <p>Keep your video and microphone enabled unless you need to pause. Your interview progress is saved automatically so you can stay focused.</p>
          <p>Answer each question clearly and use the confidence slider to self-assess how sure you are about your response.</p>
          <p>Resume analysis helps you stay aligned with the role, and the recruiter dashboard collects interview insights in one place.</p>
          <p>Do not refresh the page during the interview. If you leave this tab, you will see a warning reminder.</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="subtle-panel p-4">
            <h3 className="text-sm font-semibold text-gray-950">During the interview</h3>
            <ul className="mt-3 space-y-2 text-sm muted">
              <li>Use the answer box or record your response.</li>
              <li>Submit as soon as you are ready to move to the next question.</li>
              <li>Watch the attention meter for your focus score.</li>
            </ul>
          </div>
          <div className="subtle-panel p-4">
            <h3 className="text-sm font-semibold text-gray-950">Recommended flow</h3>
            <ul className="mt-3 space-y-2 text-sm muted">
              <li>Candidate details → Setup check → Interview → Coding → Summary.</li>
              <li>Finish the coding challenge before reviewing results.</li>
              <li>Recruiters can review candidate reports from the dashboard.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
