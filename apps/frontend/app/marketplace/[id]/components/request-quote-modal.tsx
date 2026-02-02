'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input, Textarea, Select, Label, HelperText } from '@/app/components/ui/input';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/app/components/ui/dialog';

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

/**
 * Request Quote Modal
 * Form for requesting custom pricing on an ad slot.
 */
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Success State
  if (state === 'success') {
    return (
      <Dialog open={true} onClose={onClose} size="md">
        <DialogBody className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[--success]/40 bg-[--success-light] text-[--success]">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-2 font-display text-[--text-xl] font-semibold text-[--color-text]">
            Quote Request Submitted!
          </h2>
          <p className="mb-4 text-[--text-sm] text-[--color-text-secondary]">
            Your quote ID is <span className="font-mono font-semibold">{quoteId}</span>
          </p>
          <div className="mb-6 rounded-xl border border-[--glass-border] bg-[--color-bg-subtle] p-4 text-left text-[--text-sm]">
            <p className="font-semibold text-[--color-text]">What happens next?</p>
            <ul className="mt-2 space-y-1 text-[--color-text-secondary]">
              <li>Our team will review your request</li>
              <li>You&apos;ll receive a custom quote within 24 hours</li>
              <li>We&apos;ll include pricing options and next steps</li>
            </ul>
          </div>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogBody>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onClose={onClose} size="lg">
      <DialogHeader onClose={onClose}>
        <DialogTitle>Request a Quote</DialogTitle>
        <DialogDescription>Get custom pricing for &quot;{adSlotName}&quot;</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogBody className="space-y-4">
          {/* Pricing hint */}
          <div className="flex items-center gap-3 rounded-xl border border-[--glass-border] bg-[--color-bg-subtle] p-4">
            <div className="text-[--text-sm]">
              <p className="font-semibold text-[--color-text]">
                Listed at ${adSlotPrice.toLocaleString()}/mo
              </p>
              <p className="text-[--color-text-muted]">
                Custom pricing available for bulk or long-term deals
              </p>
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" required>
              Work Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              error={Boolean(errors.email)}
            />
            {errors.email && <HelperText error>{errors.email}</HelperText>}
          </div>

          {/* Company Name */}
          <div>
            <Label htmlFor="companyName" required>
              Company Name
            </Label>
            <Input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Acme Inc."
              error={Boolean(errors.companyName)}
            />
            {errors.companyName && <HelperText error>{errors.companyName}</HelperText>}
          </div>

          {/* Phone (optional) */}
          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Budget & Timeline Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="budget">Budget Range</Label>
              <Select id="budget" name="budget" value={formData.budget} onChange={handleChange}>
                <option value="">Select budget</option>
                <option value="under-5k">Under $5,000/mo</option>
                <option value="5k-15k">$5,000 - $15,000/mo</option>
                <option value="15k-50k">$15,000 - $50,000/mo</option>
                <option value="50k+">$50,000+/mo</option>
                <option value="custom">Custom / Negotiable</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="timeline">Timeline</Label>
              <Select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
              >
                <option value="">Select timeline</option>
                <option value="asap">ASAP</option>
                <option value="1-month">Within 1 month</option>
                <option value="1-3-months">1-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="exploring">Just exploring</option>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Additional Details (optional)</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about your campaign goals, target audience, or any special requirements..."
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={state === 'loading'}>
            {state === 'loading' ? 'Submitting...' : 'Submit Quote Request'}
          </Button>
        </DialogFooter>
      </form>

      <p className="px-5 pb-4 text-center text-[--text-xs] text-[--color-text-muted]">
        By submitting, you agree to be contacted about this placement.
      </p>
    </Dialog>
  );
}
