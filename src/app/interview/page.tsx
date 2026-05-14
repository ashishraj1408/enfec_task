'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertCircle, Clock, Mic, MicOff, Play, Send, SkipForward, Video, VideoOff, X, Zap } from 'lucide-react';
import { BrandHeader } from '../components/BrandHeader';

const questions = [
  'Tell me about yourself and your professional background.',
  'What motivated you to apply for this position?',
  "Describe a challenging project you've worked on and how you overcame the challenges.",
  'How do you stay updated with the latest technologies?',
  'Tell us about a time you had to work in a team. What was your role?',
  'What is your greatest strength as a developer or professional?',
  'How do you approach problem-solving?',
  'Tell us about a mistake you made at work and what you learned from it.',
  'Where do you see yourself in 5 years?',
  'Do you have any questions for us?',
];

export default function Interview() {
  const router = useRouter();
  const [accessReady, setAccessReady] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answerError, setAnswerError] = useState('');
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [transcript, setTranscript] = useState<{ question: string; answer: string; skipped?: boolean }[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!localStorage.getItem('candidateData')) {
        router.replace('/candidate-details');
        return;
      }

      if (localStorage.getItem('interviewSetupComplete') !== 'true') {
        router.replace('/interview-setup');
        return;
      }

      setAccessReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    if (!isAnswering) return;

    const interval = window.setInterval(() => {
      setTimer((currentTime) => currentTime + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isAnswering]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveInterviewData = (answeredCount: number, timeTaken: number) => {
    localStorage.setItem(
      'interviewData',
      JSON.stringify({
        questionsAnswered: answeredCount,
        totalQuestions: questions.length,
        timeTaken,
      }),
    );
  };

  const moveToNextQuestion = (answeredCount: number, transcriptAnswer: string, skipped = false) => {
    const nextElapsed = totalElapsed + timer;
    setTotalElapsed(nextElapsed);
    setTranscript((currentTranscript) => [
      ...currentTranscript,
      {
        question: questions[currentQuestion],
        answer: transcriptAnswer,
        skipped,
      },
    ]);
    setAnswer('');
    setAnswerError('');
    setIsAnswering(false);
    setIsRecording(false);
    setTimer(0);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((questionIndex) => questionIndex + 1);
      return;
    }

    saveInterviewData(answeredCount, nextElapsed);
    router.push('/interview-summary');
  };

  const handleStartAnswer = () => {
    setAnswerError('');
    setIsAnswering(true);
  };

  const handleSubmitAnswer = () => {
    if (!isAnswering) {
      setAnswerError('Start the answer timer before submitting.');
      return;
    }

    if (!answer.trim() && !isRecording) {
      setAnswerError('Type an answer or start recording before submitting.');
      return;
    }

    const nextAnswered = answeredQuestions.includes(currentQuestion)
      ? answeredQuestions
      : [...answeredQuestions, currentQuestion];

    setAnsweredQuestions(nextAnswered);
    moveToNextQuestion(nextAnswered.length, answer.trim() || 'Voice answer recorded.');
  };

  const handleSkip = () => {
    moveToNextQuestion(answeredQuestions.length, 'Question skipped.', true);
  };

  const handleEndInterview = () => {
    saveInterviewData(answeredQuestions.length, totalElapsed + timer);
    router.push('/interview-summary');
  };

  const handleRecordingToggle = () => {
    if (!isAnswering) {
      setIsAnswering(true);
    }

    if (!micOn) {
      setAnswerError('Turn the microphone on before recording.');
      return;
    }

    setAnswerError('');
    setIsRecording((recording) => !recording);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!accessReady) {
    return (
      <main className="app-shell">
        <BrandHeader />
        <div className="app-container py-8">
          <section className="panel p-6 text-sm muted">Checking interview access...</section>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <BrandHeader
        action={
          <button type="button" onClick={() => setShowConfirmEnd(true)} className="btn btn-quiet h-10 w-10 p-0" aria-label="End interview">
            <X className="h-5 w-5" />
          </button>
        }
      />

      <div className="app-container grid gap-6 py-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="panel overflow-hidden">
            <div className="flex aspect-video items-center justify-center bg-[#eef2f7]">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white text-[var(--accent)] shadow-sm">
                  <Zap className="h-8 w-8" />
                </div>
                <p className="text-sm font-semibold text-gray-950">AI Interviewer</p>
                <div className="mt-3 flex justify-center gap-2" aria-label="AI typing animation">
                  <span className="ai-typing-dot" />
                  <span className="ai-typing-dot" />
                  <span className="ai-typing-dot" />
                </div>
                <p className="mt-3 text-sm muted">Preparing the next prompt</p>
              </div>
            </div>

            <div className="border-t border-[var(--border-color)] p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Question {currentQuestion + 1} of {questions.length}
                </h1>
                <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-soft)] px-3 py-1 text-sm text-gray-700">
                  <Clock className="h-4 w-4 text-[var(--accent)]" />
                  {formatTime(timer)}
                </div>
              </div>
              <p className="text-xl font-semibold leading-8 text-gray-950">{questions[currentQuestion]}</p>
              {!isAnswering && (
                <p className="mt-3 text-sm leading-6 muted">Press Start Answer when you are ready. The timer begins after that.</p>
              )}
              <div className="mt-5 h-2 rounded-full bg-[var(--surface-soft)]">
                <div className="h-2 rounded-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="panel p-4">
            <div className="flex aspect-video items-center justify-center rounded-lg bg-[#eef2f7]">
              {cameraOn ? (
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white font-semibold text-gray-950 shadow-sm">
                    You
                  </div>
                  <p className="text-sm muted">Camera preview placeholder</p>
                </div>
              ) : (
                <div className="text-center">
                  <VideoOff className="mx-auto mb-3 h-10 w-10 text-gray-500" />
                  <p className="text-sm muted">Camera is off</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-950">Your answer</h2>
              {isRecording && (
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--danger-soft)] px-3 py-1 text-xs font-semibold text-[var(--danger)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--danger)]" />
                  Recording
                </span>
              )}
            </div>

            <textarea
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value);
                if (event.target.value.trim()) setAnswerError('');
              }}
              placeholder="Type your answer here, or use recording."
              className={`field h-32 resize-none leading-6 ${answerError ? 'field-error' : ''}`}
              aria-label="Your answer"
            />

            {isRecording && (
              <div className="mt-3 flex h-10 items-center justify-center gap-1 rounded-lg bg-[var(--accent-soft)]" aria-label="Voice waveform animation">
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
              </div>
            )}

            {answerError && (
              <p className="error-text">
                <AlertCircle className="h-4 w-4" />
                {answerError}
              </p>
            )}

            <div className="mt-4 grid gap-3">
              <button type="button" onClick={handleStartAnswer} disabled={isAnswering} className="btn btn-secondary w-full">
                <Play className="h-4 w-4" />
                {isAnswering ? 'Answer Started' : 'Start Answer'}
              </button>
              <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={handleRecordingToggle} className={`btn ${isRecording ? 'btn-danger' : 'btn-secondary'}`}>
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isRecording ? 'Stop' : 'Record'}
              </button>
              <button type="button" onClick={handleSubmitAnswer} disabled={!isAnswering} className="btn btn-primary">
                <Send className="h-4 w-4" />
                Submit
              </button>
              </div>
            </div>
          </section>

          <section className="panel p-5">
            <h2 className="mb-3 text-sm font-semibold text-gray-950">Controls</h2>
            <div className="space-y-3">
              <button type="button" onClick={() => setCameraOn((enabled) => !enabled)} className="btn btn-secondary w-full">
                {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                {cameraOn ? 'Camera On' : 'Camera Off'}
              </button>
              <button type="button" onClick={() => setMicOn((enabled) => !enabled)} className="btn btn-secondary w-full">
                {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                {micOn ? 'Mic On' : 'Mic Off'}
              </button>
            </div>
          </section>

          <section className="panel p-5">
            <div className="grid gap-3">
              <button type="button" onClick={handleSkip} className="btn btn-secondary w-full">
                <SkipForward className="h-4 w-4" />
                Skip Question
              </button>
              <button type="button" onClick={() => setShowConfirmEnd(true)} className="btn btn-danger w-full">
                End Interview
              </button>
            </div>
          </section>

          <div className="subtle-panel p-4 text-sm leading-6 muted">
            <p>Answered: {answeredQuestions.length} of {questions.length}</p>
            <p>Remaining: {questions.length - currentQuestion}</p>
            <p>Time elapsed: {formatTime(totalElapsed + timer)}</p>
          </div>

          <section className="panel p-5">
            <h2 className="mb-3 text-sm font-semibold text-gray-950">Transcript</h2>
            <div className="max-h-56 space-y-3 overflow-y-auto text-sm leading-6">
              {transcript.length === 0 ? (
                <p className="muted">Submitted answers will appear here.</p>
              ) : (
                transcript.map((entry, index) => (
                  <div key={`${entry.question}-${index}`} className="subtle-panel p-3">
                    <p className="font-semibold text-gray-950">Q{index + 1}: {entry.question}</p>
                    <p className={`mt-1 ${entry.skipped ? 'text-[var(--warning)]' : 'muted'}`}>{entry.answer}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>

      {showConfirmEnd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/45 px-4">
          <div className="panel w-full max-w-sm p-6">
            <h2 className="text-xl font-semibold text-gray-950">End interview?</h2>
            <p className="mt-2 leading-7 muted">Your answered questions will be submitted for review.</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setShowConfirmEnd(false)} className="btn btn-secondary flex-1">
                Continue
              </button>
              <button type="button" onClick={handleEndInterview} className="btn btn-danger flex-1">
                End
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
