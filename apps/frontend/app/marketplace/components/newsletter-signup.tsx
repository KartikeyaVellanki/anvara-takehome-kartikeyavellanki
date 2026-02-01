'use client';

import { useState } from 'react';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Basic email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
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
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/20">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-xl dark:bg-green-800">
            ✓
          </span>
          <div>
            <p className="font-semibold text-green-800 dark:text-green-200">
              You&apos;re subscribed!
            </p>
            <p className="text-sm text-green-600 dark:text-green-300">
              Watch your inbox for exclusive deals.
            </p>
          </div>
        </div>
        <button
          onClick={() => setState('idle')}
          className="mt-3 text-sm text-green-700 underline hover:text-green-800 dark:text-green-300"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[--color-border] bg-gradient-to-br from-[--color-primary]/5 to-[--color-secondary]/5 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">📬</span>
        <h3 className="font-semibold">Get Exclusive Deals</h3>
      </div>
      <p className="mb-4 text-sm text-[--color-muted]">
        Subscribe to receive alerts about new premium placements and special pricing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id="newsletter-email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state === 'error') setState('idle');
            }}
            placeholder="you@company.com"
            className={`w-full rounded-lg border px-4 py-3 text-base transition-colors focus:outline-none focus:ring-2 ${
              state === 'error'
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:bg-red-900/20'
                : 'border-[--color-border] bg-white focus:border-[--color-primary] focus:ring-[--color-primary]/20 dark:bg-slate-800'
            }`}
            disabled={state === 'loading'}
            aria-describedby={state === 'error' ? 'newsletter-error' : undefined}
          />
          {state === 'error' && (
            <p id="newsletter-error" className="mt-1 text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={state === 'loading'}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[--color-primary] px-4 py-3 font-medium text-white transition-all hover:bg-[--color-primary-hover] disabled:opacity-70"
        >
          {state === 'loading' ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Subscribing...
            </>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>

      <p className="mt-3 text-center text-xs text-[--color-muted]">No spam, unsubscribe anytime.</p>
    </div>
  );
}
