'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Newsletter Signup Component
 *
 * Clean form for email capture with proper validation and states.
 */
export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setState('error');
      setErrorMessage('Please enter your email');
      return;
    }

    if (!isValidEmail(email)) {
      setState('error');
      setErrorMessage('Please enter a valid email');
      return;
    }

    setState('loading');
    setErrorMessage('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/newsletter/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setState('success');
      setEmail('');
    } catch (err) {
      setState('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  // Success state
  if (state === 'success') {
    return (
    <div className="rounded-2xl border border-[--success]/40 bg-[--success-light] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[--success]/40 text-[--success]">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-[--color-text]">You&apos;re subscribed!</p>
            <p className="text-[--text-sm] text-[--color-text-secondary]">Watch your inbox for updates.</p>
          </div>
        </div>
        <button
          onClick={() => setState('idle')}
          className="mt-3 text-[--text-sm] text-[--color-text-secondary] underline hover:text-[--color-text]"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--glass-surface)] p-5 backdrop-blur-xl">
      <h3 className="mb-1 font-display text-[--text-sm] font-semibold uppercase tracking-wide text-[--color-text]">
        Newsletter
      </h3>
      <p className="mb-4 text-[--text-sm] text-[--color-text-secondary]">
        Get alerts about new placements and special pricing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <Input
            type="email"
            id="newsletter-email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state === 'error') setState('idle');
            }}
            placeholder="you@company.com"
            error={state === 'error'}
            disabled={state === 'loading'}
            aria-describedby={state === 'error' ? 'newsletter-error' : undefined}
          />
          {state === 'error' && (
            <p
              id="newsletter-error"
              className="mt-1.5 text-[--text-xs] text-[--error]"
              role="alert"
            >
              {errorMessage}
            </p>
          )}
        </div>

        <Button type="submit" isLoading={state === 'loading'} className="w-full">
          Subscribe
        </Button>
      </form>

      <p className="mt-3 text-center text-[--text-xs] text-[--color-text-muted]">
        No spam, unsubscribe anytime.
      </p>
    </div>
  );
}
