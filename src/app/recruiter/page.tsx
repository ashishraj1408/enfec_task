import Link from 'next/link';
import { Award, Briefcase, CheckCircle2, ClipboardList, Users } from 'lucide-react';
import { BrandHeader } from '../components/BrandHeader';

const candidateSamples = [
  {
    name: 'Avery Chen',
    role: 'Frontend Engineer',
    progress: 'Interview + Coding complete',
    score: 86,
    status: 'Ready for review',
  },
  {
    name: 'Devin Walker',
    role: 'Full-stack Developer',
    progress: 'Interview complete',
    score: 74,
    status: 'Needs coding submission',
  },
  {
    name: 'Mia Patel',
    role: 'QA Engineer',
    progress: 'Interview + Coding complete',
    score: 92,
    status: 'Strong candidate',
  },
];

export default function RecruiterDashboard() {
  return (
    <main className="app-shell">
      <BrandHeader title="Recruiter dashboard" />

      <div className="app-container py-10">
        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="panel p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-950">Active candidates</p>
                <p className="mt-1 text-3xl font-semibold text-gray-950">12</p>
              </div>
            </div>
            <p className="text-sm muted">Live sessions and interview progress from the current hiring cycle.</p>
          </div>
          <div className="panel p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                <ClipboardList className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-950">Pending reviews</p>
                <p className="mt-1 text-3xl font-semibold text-gray-950">5</p>
              </div>
            </div>
            <p className="text-sm muted">Candidates who have completed all steps and are awaiting recruiter feedback.</p>
          </div>
          <div className="panel p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                <Award className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-950">Average score</p>
                <p className="mt-1 text-3xl font-semibold text-gray-950">81%</p>
              </div>
            </div>
            <p className="text-sm muted">Average interview and coding performance across completed sessions.</p>
          </div>
        </section>

        <section className="panel p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-950">Interview feedback dashboard</h1>
              <p className="mt-2 muted">Quickly review candidate progress and surface the strongest performers.</p>
            </div>
            <Link href="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>

          <div className="space-y-4">
            {candidateSamples.map((candidate) => (
              <div key={candidate.name} className="subtle-panel p-4 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-gray-950">{candidate.name}</p>
                  <p className="mt-1 text-sm muted">{candidate.role}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{candidate.progress}</p>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:items-end">
                  <p className="text-sm font-semibold text-gray-950">Score</p>
                  <p className="text-2xl font-semibold text-[var(--accent)]">{candidate.score}%</p>
                  <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-gray-700">{candidate.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
