'use client';

import { useState, useRef } from 'react';
import Toast from './Toast';

interface WaitlistFormProps {
  id?: string;
  formId: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function WaitlistForm({ id, formId }: WaitlistFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<{ message: string; key: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setToast({ message, key: Date.now() });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = inputRef.current?.value ?? '';

    if (!isValidEmail(email)) {
      showToast('⚠ Please enter a valid email address.');
      inputRef.current?.focus();
      return;
    }

    setSubmitted(true);
    showToast('✦ Access request received. Welcome to Architeq.');

    /*
     * Production: replace with your API call
     * fetch('/api/waitlist', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({ email }),
     * });
     */
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 w-full" id={id}>
        {!submitted ? (
          <form
            id={formId}
            onSubmit={handleSubmit}
            noValidate
            aria-label="Waitlist signup"
            className="flex w-full max-w-[520px] rounded-[var(--radius-md)] border border-[var(--border-glow)] bg-[rgba(14,14,22,0.8)] overflow-hidden focus-within:border-[var(--accent-purple)] transition-all duration-300"
            style={{ boxShadow: 'none' }}
            onFocus={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--glow-purple)'; }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }
            }}
          >
            <label htmlFor={`${formId}-email`} className="sr-only">Your email address</label>
            <input
              ref={inputRef}
              type="email"
              id={`${formId}-email`}
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              aria-required="true"
              className="flex-1 bg-transparent border-none outline-none px-[18px] py-[15px] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] placeholder-italic min-w-0"
              style={{ fontFamily: 'inherit' }}
            />
            <button
              type="submit"
              className="px-6 py-[15px] border-none border-l border-[var(--border-subtle)] text-white text-[13px] font-bold cursor-pointer whitespace-nowrap relative overflow-hidden transition-all duration-200 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                borderLeft: '1px solid var(--border-subtle)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'linear-gradient(135deg, #a78bfa, #8b5cf6)';
                el.style.boxShadow = 'var(--glow-btn)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'linear-gradient(135deg, #8b5cf6, #6d28d9)';
                el.style.boxShadow = 'none';
              }}
            >
              Join Private Beta&nbsp;(500 spots left)
            </button>
          </form>
        ) : (
          <div
            className="flex flex-col items-center gap-[10px] px-8 py-5 rounded-[var(--radius-md)] border border-[rgba(139,92,246,0.4)] bg-[rgba(139,92,246,0.08)] w-full max-w-[520px]"
            role="status"
            aria-live="polite"
            style={{ animation: 'fadeInUp 0.5s ease forwards' }}
          >
            <span className="text-base font-bold text-[var(--accent-purple-bright)]">✦ You&apos;re on the list</span>
            <span className="text-[13px] text-[var(--text-secondary)] font-mono text-center">
              // Access granted. We&apos;ll reach out soon.
            </span>
          </div>
        )}

        <p className="text-[13px] text-[var(--text-muted)] font-mono tracking-wide">
          <span className="text-[var(--accent-purple-bright)] font-semibold">// 100+</span> developers leaving the token trap.
        </p>
      </div>

      {toast && <Toast key={toast.key} message={toast.message} />}
    </>
  );
}
