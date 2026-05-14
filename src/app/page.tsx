import Link from 'next/link';
import { ArrowRight, BarChart3, CheckCircle2, Clock, ShieldCheck, Zap } from 'lucide-react';
import { BrandHeader } from './components/BrandHeader';

export default function Home() {
  return (
    <main className="app-shell">
      <BrandHeader />

      <section className="app-container grid gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
        <div className="max-w-2xl space-y-8">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-500">
              Candidate interview workspace
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-gray-950 sm:text-5xl">
              Practice interviews in a clean, focused workflow.
            </h1>
            <p className="max-w-xl text-lg leading-8 muted">
              Move from candidate details to setup, interview questions, coding, and a review summary without visual noise or confusing controls.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Zap, title: 'Guided flow', copy: 'Step-by-step interview screens.' },
              { icon: ShieldCheck, title: 'Controlled data', copy: 'Details stay in this browser session.' },
              { icon: Clock, title: 'Timed answers', copy: 'Recording state and elapsed time.' },
            ].map((item) => (
              <div key={item.title} className="subtle-panel p-4">
                <item.icon className="mb-3 h-5 w-5 text-[var(--accent)]" />
                <h2 className="font-semibold text-gray-950">{item.title}</h2>
                <p className="mt-1 text-sm leading-6 muted">{item.copy}</p>
              </div>
            ))}
          </div>

          <Link href="/candidate-details" className="btn btn-primary w-full sm:w-auto">
            Start Interview
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="subtle-panel grid gap-4 p-4 sm:grid-cols-3" aria-label="Interview instructions">
            {[
              ['01', 'Fill candidate details before setup.'],
              ['02', 'Allow camera and microphone checks.'],
              ['03', 'Answer 10 questions in about 45 minutes.'],
            ].map(([step, copy]) => (
              <div key={step} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
                <p className="text-sm leading-6 text-gray-800">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="border-b border-[var(--border-color)] px-6 py-4">
            <p className="text-sm font-semibold text-gray-950">Interview Progress</p>
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {[
              ['01', 'Candidate details', 'Collect role, experience, and skills.'],
              ['02', 'Setup check', 'Confirm camera, microphone, internet, and guidelines.'],
              ['03', 'Interview', 'Answer behavioral and role-based questions.'],
              ['04', 'Summary', 'Review completion score and next actions.'],
            ].map(([step, title, copy]) => (
              <div key={step} className="flex gap-4 px-6 py-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent)]">
                  {step}
                </span>
                <div>
                  <h2 className="font-semibold text-gray-950">{title}</h2>
                  <p className="mt-1 text-sm leading-6 muted">{copy}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[var(--surface-soft)] px-6 py-5">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-[var(--accent)]" />
              <p className="text-sm font-medium text-gray-800">Estimated duration: 45 minutes. Designed for repeat practice and clear review.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
