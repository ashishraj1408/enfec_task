'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Check, ChevronDown, Copy, Play } from 'lucide-react';
import { BrandHeader } from '../components/BrandHeader';

const codeSnippets: Record<string, string> = {
  javascript: `function solution(arr) {\n  // Write your solution here\n  return arr;\n}`,
  python: `def solution(arr):\n    # Write your solution here\n    return arr`,
  cpp: `#include <vector>\nusing namespace std;\n\nvector<int> solution(vector<int>& arr) {\n    // Write your solution here\n    return arr;\n}`,
  java: `public class Solution {\n    public int[] solution(int[] arr) {\n        // Write your solution here\n        return arr;\n    }\n}`,
};

const codingProblem = {
  title: 'Two Sum',
  difficulty: 'Easy',
  description:
    'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.',
  examples: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
      explanation: 'The sum of 2 and 7 is 9, so the answer is [0,1].',
    },
    {
      input: 'nums = [3,2,4], target = 6',
      output: '[1,2]',
      explanation: 'The sum of 2 and 4 is 6, so the answer is [1,2].',
    },
  ],
};

export default function CodingQuestion() {
  const router = useRouter();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(codeSnippets.javascript);
  const [showOutput, setShowOutput] = useState(false);
  const [output, setOutput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [savedAt, setSavedAt] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const candidateData = localStorage.getItem('candidateData');
      const interviewData = localStorage.getItem('interviewData');

      if (!candidateData || !interviewData) {
        router.replace(candidateData ? '/interview' : '/candidate-details');
        return;
      }

      const savedDraft = localStorage.getItem('codingDraft');
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed.language) setLanguage(parsed.language);
          if (parsed.code) setCode(parsed.code);
          if (parsed.savedAt) setSavedAt(parsed.savedAt);
        } catch {
          // ignore invalid draft state
        }
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  const saveDraft = (nextLanguage: string, nextCode: string) => {
    const draft = {
      language: nextLanguage,
      code: nextCode,
      savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    localStorage.setItem('codingDraft', JSON.stringify(draft));
    setSavedAt(draft.savedAt);
  };

  const handleLanguageChange = (nextLanguage: string) => {
    setLanguage(nextLanguage);
    const nextCode = codeSnippets[nextLanguage] || '';
    setCode(nextCode);
    setCodeError('');
    setShowOutput(false);
    saveDraft(nextLanguage, nextCode);
  };

  const validateCode = () => {
    if (!code.trim()) {
      setCodeError('Write a solution before running or submitting.');
      return false;
    }

    setCodeError('');
    return true;
  };

  const handleRunCode = () => {
    if (!validateCode()) return;

    setOutput('Running sample tests...');
    setShowOutput(true);
    window.setTimeout(() => {
      setOutput('Output:\n[0, 1]\n\nSample test passed.');
    }, 700);
  };

  const handleCopyCode = async () => {
    if (!code.trim()) {
      setCodeError('There is no code to copy.');
      return;
    }

    await navigator.clipboard.writeText(code);
    setCopyStatus('Copied');
    window.setTimeout(() => setCopyStatus(''), 1400);
  };

  const handleSubmitCode = () => {
    if (!validateCode()) return;

    saveDraft(language, code);
    localStorage.setItem(
      'codingData',
      JSON.stringify({
        language,
        submitted: true,
        challenge: codingProblem.title,
      }),
    );
    router.replace('/interview-summary');
  };

  return (
    <main className="app-shell">
      <BrandHeader title="InterviewAI - Coding Challenge" />

      <div className="app-container grid gap-6 py-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="panel p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-950">{codingProblem.title}</h1>
              <p className="mt-2 leading-7 muted">{codingProblem.description}</p>
            </div>
            <span className="rounded-full border border-[var(--success)] bg-[var(--success-soft)] px-3 py-1 text-xs font-semibold text-[var(--success)]">
              {codingProblem.difficulty}
            </span>
          </div>

          <div className="subtle-panel p-4">
            <h2 className="mb-2 text-sm font-semibold text-gray-950">Constraints</h2>
            <ul className="space-y-1 text-sm leading-6 muted">
              <li>2 &lt;= nums.length &lt;= 10000</li>
              <li>-1000000000 &lt;= nums[i] &lt;= 1000000000</li>
              <li>-1000000000 &lt;= target &lt;= 1000000000</li>
              <li>Only one valid answer exists.</li>
            </ul>
          </div>

          <div className="mt-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-950">Examples</h2>
            {codingProblem.examples.map((example) => (
              <div key={example.input} className="subtle-panel p-4">
                <div className="space-y-1 font-mono text-xs text-gray-800">
                  <p>
                    <span className="font-semibold">Input:</span> {example.input}
                  </p>
                  <p>
                    <span className="font-semibold">Output:</span> {example.output}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 muted">{example.explanation}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="panel p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label htmlFor="language" className="text-sm font-semibold text-gray-950">
                Language
              </label>
              <div className="relative sm:w-56">
                <select
                  id="language"
                  value={language}
                  onChange={(event) => handleLanguageChange(event.target.value)}
                  className="field select-field"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--surface-soft)] px-4 py-3">
              <div>
                <span className="font-mono text-xs text-gray-600">editor.{language}</span>
                <p className="mt-1 text-[0.8rem] text-[var(--muted)]">Draft saved at {savedAt || 'now'}</p>
              </div>
              <button type="button" onClick={handleCopyCode} className="btn btn-quiet min-h-9 px-3 py-2" title="Copy code">
                {copyStatus ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copyStatus || 'Copy'}
              </button>
            </div>

            <textarea
              value={code}
              onChange={(event) => {
                const nextCode = event.target.value;
                setCode(nextCode);
                if (nextCode.trim()) setCodeError('');
                saveDraft(language, nextCode);
              }}
              className={`code-editor h-96 w-full resize-none border-0 px-4 py-4 font-mono text-sm leading-6 focus:outline-none ${codeError ? 'ring-2 ring-[var(--danger)]' : ''}`}
              spellCheck="false"
              aria-invalid={Boolean(codeError)}
            />
          </div>

          {codeError && (
            <p className="error-text">
              <AlertCircle className="h-4 w-4" />
              {codeError}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={handleRunCode} className="btn btn-secondary">
              <Play className="h-4 w-4" />
              Run Code
            </button>
            <button type="button" onClick={handleSubmitCode} className="btn btn-primary">
              Submit Code
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {showOutput && (
            <div className="panel p-4">
              <h2 className="mb-3 text-sm font-semibold text-gray-950">Output</h2>
              <pre className="code-editor max-h-56 overflow-auto rounded-lg p-4 text-sm leading-6 whitespace-pre-wrap">{output}</pre>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
