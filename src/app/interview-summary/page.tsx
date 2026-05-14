'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Award, CheckCircle2, Clock, Download, Home, Share2, TrendingUp } from 'lucide-react';
import { BrandHeader } from '../components/BrandHeader';

export default function InterviewSummary() {
  const [candidateName, setCandidateName] = useState('Candidate');
  const [role, setRole] = useState('Role not specified');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const candidateData = localStorage.getItem('candidateData');
      const interviewData = localStorage.getItem('interviewData');

      if (candidateData) {
        const data = JSON.parse(candidateData);
        setCandidateName(data.fullName || 'Candidate');
        setRole(data.roleAppliedFor || 'Role not specified');
      }

      if (interviewData) {
        const data = JSON.parse(interviewData);
        setQuestionsAnswered(data.questionsAnswered || 0);
        setTotalQuestions(data.totalQuestions || 10);
        setTimeTaken(data.timeTaken || 0);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const completionPercentage = totalQuestions ? Math.round((questionsAnswered / totalQuestions) * 100) : 0;
  const performanceScore = Math.min(100, Math.round(completionPercentage * 0.85 + 15));
  const formattedTimeTaken = `${Math.floor(timeTaken / 60)}m ${String(timeTaken % 60).padStart(2, '0')}s`;

  const reportText = useMemo(() => {
    return [
      'InterviewAI Report',
      `Candidate: ${candidateName}`,
      `Role: ${role}`,
      `Completion: ${questionsAnswered}/${totalQuestions}`,
      `Time taken: ${formattedTimeTaken}`,
      `Performance score: ${performanceScore}/100`,
      '',
      'Strengths:',
      '- Clear communication and articulation',
      '- Strong problem-solving approach',
      '- Good understanding of core concepts',
      '',
      'Areas for improvement:',
      '- Provide more specific examples',
      '- Go deeper into technical tradeoffs',
      '- Discuss edge cases and error handling',
    ].join('\n');
  }, [candidateName, formattedTimeTaken, performanceScore, questionsAnswered, role, totalQuestions]);

  const handleDownloadReport = () => {
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${candidateName.replace(/\s+/g, '-').toLowerCase()}-interview-report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShareResults = async () => {
    const shareText = `${candidateName}'s InterviewAI report: ${performanceScore}/100, ${completionPercentage}% complete.`;

    if (navigator.share) {
      await navigator.share({ title: 'InterviewAI Report', text: shareText });
      return;
    }

    await navigator.clipboard.writeText(shareText);
    setShareStatus('Copied summary link text');
    window.setTimeout(() => setShareStatus(''), 1600);
  };

  const strengths = [
    'Clear communication and articulation',
    'Strong problem-solving approach',
    'Good understanding of core concepts',
    'Professional demeanor and confidence',
  ];

  const improvements = [
    'Provide more specific examples',
    'Go deeper into technical tradeoffs',
    'Structure answers with context first',
    'Discuss edge cases and error handling',
  ];

  return (
    <main className="app-shell">
      <BrandHeader title="InterviewAI - Summary" maxWidthClassName="mx-auto w-full max-w-4xl px-4" />

      <div className="mx-auto max-w-4xl px-4 py-10">
        <section className="panel mb-6 p-6 text-center sm:p-8">
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-[var(--success)]" />
          <h1 className="text-3xl font-semibold text-gray-950">Interview submitted successfully</h1>
          <p className="mx-auto mt-3 max-w-2xl leading-7 muted">
            Thank you, <span className="font-semibold text-gray-900">{candidateName}</span>. Your interview for{' '}
            <span className="font-semibold text-gray-900">{role}</span> has been saved for review.
          </p>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="panel p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                <Award className="h-5 w-5" />
              </span>
              <h2 className="text-sm font-semibold text-gray-950">Completion</h2>
            </div>
            <p className="text-4xl font-semibold text-gray-950">{completionPercentage}%</p>
            <p className="mt-1 text-sm muted">{questionsAnswered}/{totalQuestions} questions answered</p>
            <div className="mt-4 h-2 rounded-full bg-[var(--surface-soft)]">
              <div className="h-2 rounded-full bg-[var(--accent)]" style={{ width: `${completionPercentage}%` }} />
            </div>
          </div>

          <div className="panel p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                <Clock className="h-5 w-5" />
              </span>
              <h2 className="text-sm font-semibold text-gray-950">Time taken</h2>
            </div>
            <p className="text-3xl font-semibold text-gray-950">{formattedTimeTaken}</p>
            <p className="mt-1 text-sm muted">Across answered questions</p>
          </div>

          <div className="panel p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                <TrendingUp className="h-5 w-5" />
              </span>
              <h2 className="text-sm font-semibold text-gray-950">Performance</h2>
            </div>
            <p className="text-4xl font-semibold text-gray-950">{performanceScore}/100</p>
            <p className="mt-1 text-sm muted">Overall simulated evaluation</p>
          </div>

          <div className="panel p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--success-soft)] text-[var(--success)]">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <h2 className="text-sm font-semibold text-gray-950">Status</h2>
            </div>
            <p className="rounded-lg border border-[#bee5c8] bg-[var(--success-soft)] px-3 py-2 text-sm font-semibold text-[var(--success)]">
              Submitted for review
            </p>
            <p className="mt-3 text-sm muted">Expected review within 24 hours.</p>
          </div>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="panel p-5">
            <h2 className="mb-4 text-lg font-semibold text-gray-950">Strengths</h2>
            <ul className="space-y-3">
              {strengths.map((strength) => (
                <li key={strength} className="flex items-start gap-3 text-sm leading-6 text-gray-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="panel p-5">
            <h2 className="mb-4 text-lg font-semibold text-gray-950">Areas for improvement</h2>
            <ul className="space-y-3">
              {improvements.map((improvement) => (
                <li key={improvement} className="flex items-start gap-3 text-sm leading-6 text-gray-800">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel mb-6 p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-950">Interview transcript</h2>
            <button type="button" onClick={() => setShowFullTranscript((visible) => !visible)} className="btn btn-quiet min-h-9 px-3 py-2 text-sm">
              {showFullTranscript ? 'Show Less' : 'View Full Transcript'}
            </button>
          </div>
          <div className="subtle-panel max-h-72 space-y-4 overflow-y-auto p-4">
            <div>
              <p className="text-xs font-semibold text-[var(--accent)]">Interviewer</p>
              <p className="mt-1 text-sm leading-6 text-gray-800">Tell me about your professional background and experience.</p>
            </div>
            <div className="border-t border-[var(--border-color)] pt-4">
              <p className="text-xs font-semibold text-gray-600">Candidate</p>
              <p className="mt-1 text-sm leading-6 text-gray-800">I have experience in full-stack web development and production delivery.</p>
            </div>
            {showFullTranscript && (
              <>
                <div className="border-t border-[var(--border-color)] pt-4">
                  <p className="text-xs font-semibold text-[var(--accent)]">Interviewer</p>
                  <p className="mt-1 text-sm leading-6 text-gray-800">Can you describe a challenging project you worked on?</p>
                </div>
                <div className="border-t border-[var(--border-color)] pt-4">
                  <p className="text-xs font-semibold text-gray-600">Candidate</p>
                  <p className="mt-1 text-sm leading-6 text-gray-800">I focused on clarifying requirements, breaking work into smaller releases, and validating edge cases early.</p>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <Link href="/" className="btn btn-secondary">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <button type="button" onClick={handleDownloadReport} className="btn btn-secondary">
            <Download className="h-4 w-4" />
            Download Report
          </button>
          <button type="button" onClick={handleShareResults} className="btn btn-primary">
            <Share2 className="h-4 w-4" />
            {shareStatus || 'Share Results'}
          </button>
        </section>

        <p className="mt-6 text-center text-xs leading-6 muted">
          This is a simulated AI evaluation. Final hiring decisions should be made by the hiring team.
        </p>
      </div>
    </main>
  );
}
