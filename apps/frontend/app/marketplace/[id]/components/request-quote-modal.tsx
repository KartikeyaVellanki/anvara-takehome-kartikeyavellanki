'use client';

import { useState } from 'react';

interface RequestQuoteModalProps {
  adSlotId: string;
  adSlotName: string;
  adSlotPrice: number;
  onClose: () => void;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

interface FormErrors {
  email?: string;
  companyName?: string;
}

export function RequestQuoteModal({
  adSlotId,
  adSlotName,
  adSlotPrice,
  onClose,
}: RequestQuoteModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    phone: '',
    budget: '',
    timeline: '',
    message: '',
  });
  const [state, setState] = useState<SubmitState>('idle');
  const [errors, setErrors] = useState<FormErrors>({});
  const [quoteId, setQuoteId] = useState<string>('');

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setState('loading');
    setErrors({});

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/quotes/request`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            adSlotId,
            adSlotName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit quote request');
      }

      setQuoteId(data.quoteId);
      setState('success');
    } catch (err) {
      setState('error');
      setErrors({ email: err instanceof Error ? err.message : 'Something went wrong' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClasses =
    'w-full rounded-lg border border-[--color-border] bg-white px-4 py-3 text-base transition-colors focus:border-[--color-secondary] focus:outline-none focus:ring-2 focus:ring-[--color-secondary]/20 dark:bg-slate-800';

  // Success State
  if (state === 'success') {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-8 shadow-xl animate-in slide-in-from-bottom duration-300 dark:bg-slate-800 sm:max-w-lg sm:rounded-2xl">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl dark:bg-green-900/50">
              ✓
            </div>
            <h2 className="mb-2 text-xl font-bold text-green-800 dark:text-green-200">
              Quote Request Submitted!
            </h2>
            <p className="mb-4 text-[--color-muted]">
              Your quote ID is <span className="font-mono font-semibold">{quoteId}</span>
            </p>
            <div className="mb-6 rounded-lg bg-slate-50 p-4 text-left text-sm dark:bg-slate-700/50">
              <p className="font-medium">What happens next?</p>
              <ul className="mt-2 space-y-1 text-[--color-muted]">
                <li>• Our team will review your request</li>
                <li>• You&apos;ll receive a custom quote within 24 hours</li>
                <li>• We&apos;ll include pricing options and next steps</li>
              </ul>
            </div>
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-[--color-primary] px-5 py-3 font-medium text-white transition-colors hover:bg-[--color-primary-hover]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl animate-in slide-in-from-bottom duration-300 dark:bg-slate-800 sm:max-w-lg sm:rounded-2xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">Request a Quote</h2>
            <p className="text-sm text-[--color-muted]">
              Get custom pricing for &quot;{adSlotName}&quot;
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[--color-muted] transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Pricing hint */}
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50">
          <span className="text-2xl">💰</span>
          <div className="text-sm">
            <p className="font-medium">Listed at ${adSlotPrice.toLocaleString()}/mo</p>
            <p className="text-[--color-muted]">Custom pricing available for bulk or long-term deals</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Work Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className={`${inputClasses} ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="mb-2 block text-sm font-medium">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Acme Inc."
              className={`${inputClasses} ${errors.companyName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
            />
            {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
          </div>

          {/* Phone (optional) */}
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone <span className="text-[--color-muted]">(optional)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className={inputClasses}
            />
          </div>

          {/* Budget & Timeline Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="budget" className="mb-2 block text-sm font-medium">
                Budget Range
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Select budget</option>
                <option value="under-5k">Under $5,000/mo</option>
                <option value="5k-15k">$5,000 - $15,000/mo</option>
                <option value="15k-50k">$15,000 - $50,000/mo</option>
                <option value="50k+">$50,000+/mo</option>
                <option value="custom">Custom / Negotiable</option>
              </select>
            </div>
            <div>
              <label htmlFor="timeline" className="mb-2 block text-sm font-medium">
                Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Select timeline</option>
                <option value="asap">ASAP</option>
                <option value="1-month">Within 1 month</option>
                <option value="1-3-months">1-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="exploring">Just exploring</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium">
              Additional Details <span className="text-[--color-muted]">(optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about your campaign goals, target audience, or any special requirements..."
              className={inputClasses}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[--color-border] pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[--color-border] px-5 py-3 font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={state === 'loading'}
              className="flex min-w-[160px] items-center justify-center gap-2 rounded-lg bg-[--color-secondary] px-5 py-3 font-medium text-white shadow-sm transition-all hover:bg-[--color-secondary-hover] hover:shadow-md disabled:opacity-70"
            >
              {state === 'loading' ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                'Submit Quote Request'
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-[--color-muted]">
          By submitting, you agree to be contacted about this placement.
        </p>
      </div>
    </div>
  );
}
