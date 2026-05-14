'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, Check, Loader2, Mic, RefreshCw, Video, Wifi } from 'lucide-react';
import { BrandHeader } from '../components/BrandHeader';

type DeviceStatus = 'checking' | 'ready' | 'blocked' | 'unsupported';

export default function InterviewSetup() {
  const router = useRouter();
  const [accessReady, setAccessReady] = useState(false);
  const [checks, setChecks] = useState({
    camera: 'checking' as DeviceStatus,
    microphone: 'checking' as DeviceStatus,
    internet: true,
    guidelines: false,
  });
  const [attemptedStart, setAttemptedStart] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!localStorage.getItem('candidateData')) {
        router.replace('/candidate-details');
        return;
      }

      setAccessReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    if (!accessReady) return;

    const updateInternetStatus = () => {
      setChecks((currentChecks) => ({ ...currentChecks, internet: navigator.onLine }));
    };

    updateInternetStatus();
    window.addEventListener('online', updateInternetStatus);
    window.addEventListener('offline', updateInternetStatus);

    return () => {
      window.removeEventListener('online', updateInternetStatus);
      window.removeEventListener('offline', updateInternetStatus);
    };
  }, [accessReady]);

  const checkMediaPermissions = useCallback(async () => {
    setAttemptedStart(false);
    setChecks((currentChecks) => ({ ...currentChecks, camera: 'checking', microphone: 'checking' }));

    if (!navigator.mediaDevices?.getUserMedia) {
      setChecks((currentChecks) => ({ ...currentChecks, camera: 'unsupported', microphone: 'unsupported' }));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setChecks((currentChecks) => ({ ...currentChecks, camera: 'ready', microphone: 'ready' }));
    } catch {
      setChecks((currentChecks) => ({ ...currentChecks, camera: 'blocked', microphone: 'blocked' }));
    }
  }, []);

  useEffect(() => {
    if (!accessReady) return;

    const timer = window.setTimeout(() => {
      void checkMediaPermissions();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [accessReady, checkMediaPermissions]);

  const devicesReady = checks.camera === 'ready' && checks.microphone === 'ready';
  const allChecksPassed = devicesReady && checks.internet && checks.guidelines;

  const handleStartInterview = () => {
    setAttemptedStart(true);
    if (allChecksPassed) {
      localStorage.setItem('interviewSetupComplete', 'true');
      router.push('/interview');
    }
  };

  const StatusIcon = ({ status }: { status: boolean | DeviceStatus }) => {
    if (status === true || status === 'ready') return <Check className="h-5 w-5 text-[var(--success)]" />;
    if (status === 'checking') return <Loader2 className="h-5 w-5 animate-spin text-[var(--accent)]" />;
    return <AlertCircle className="h-5 w-5 text-[var(--warning)]" />;
  };

  const statusText = (status: boolean | DeviceStatus, fallback: string) => {
    if (status === true || status === 'ready') return 'Ready';
    if (status === false) return fallback;
    if (status === 'checking') return 'Waiting for browser permission...';
    if (status === 'unsupported') return 'This browser does not support device permission checks.';
    return 'Permission blocked. Allow access in the browser and retry.';
  };

  if (!accessReady) {
    return (
      <main className="app-shell">
        <BrandHeader maxWidthClassName="mx-auto w-full max-w-4xl px-4" />
        <div className="mx-auto max-w-2xl px-4 py-10">
          <section className="panel p-6 text-sm muted">Checking candidate details...</section>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <BrandHeader maxWidthClassName="mx-auto w-full max-w-4xl px-4" />

      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6">
          <div className="step-pill">
            <span>2</span>
            <span>Setup Check</span>
          </div>
        </div>

        <section className="panel p-6 sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-semibold text-gray-950">Before we begin</h1>
            <p className="mt-2 leading-7 muted">Confirm your devices and guidelines so the interview starts cleanly.</p>
          </div>

          <div className="space-y-3">
            {[
              { key: 'camera', icon: Video, title: 'Camera access', copy: 'Video recording is used for the interview.' },
              { key: 'microphone', icon: Mic, title: 'Microphone access', copy: 'Audio recording is used for spoken answers.' },
              { key: 'internet', icon: Wifi, title: 'Internet connection', copy: 'A stable connection is required.' },
            ].map((item) => {
              const status = checks[item.key as keyof typeof checks];

              return (
                <div key={item.key} className="subtle-panel flex items-center gap-4 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold text-gray-950">{item.title}</h2>
                    <p className="mt-1 text-sm muted">{statusText(status, item.copy)}</p>
                  </div>
                  <StatusIcon status={status} />
                </div>
              );
            })}
          </div>

          {!devicesReady && (
            <button type="button" onClick={checkMediaPermissions} className="btn btn-secondary mt-4 w-full">
              <RefreshCw className="h-4 w-4" />
              Retry Camera and Microphone Permission
            </button>
          )}

          <div className="mt-7 border-t border-[var(--border-color)] pt-6">
            <h2 className="mb-3 text-sm font-semibold text-gray-950">Interview guidelines</h2>
            <div className="subtle-panel max-h-48 space-y-3 overflow-y-auto p-4 text-sm leading-6 muted">
              <p>Use a quiet, well-lit environment for the interview.</p>
              <p>Keep your camera, microphone, and internet connection available throughout.</p>
              <p>Do not minimize the browser window during the interview.</p>
              <p>Answer each question clearly and to the best of your ability.</p>
              <p>You cannot return to previous questions after moving forward.</p>
              <p>The estimated duration is 45 minutes for 10 questions.</p>
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={checks.guidelines}
                onChange={(event) => setChecks((currentChecks) => ({ ...currentChecks, guidelines: event.target.checked }))}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span className="text-sm leading-6 text-gray-800">I have read and understand the interview guidelines.</span>
            </label>
          </div>

          <div className={`mt-6 rounded-lg border p-4 text-sm font-medium ${allChecksPassed ? 'status-success' : 'status-warning'}`}>
            {allChecksPassed ? 'Everything is ready. You can start the interview.' : 'Complete all checks before starting.'}
          </div>

          {attemptedStart && !allChecksPassed && (
            <p className="error-text">
              <AlertCircle className="h-4 w-4" />
              Allow camera and microphone access, stay online, and accept the guidelines before starting.
            </p>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
            <Link href="/candidate-details" className="btn btn-secondary sm:w-32">
              Back
            </Link>
            <button type="button" onClick={handleStartInterview} disabled={!allChecksPassed} className="btn btn-primary flex-1">
              Start Interview
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
