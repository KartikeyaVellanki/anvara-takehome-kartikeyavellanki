'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdSlot } from '@/lib/api';
import { authClient } from '@/auth-client';
import { RequestQuoteModal } from './request-quote-modal';
import { useAnalytics } from '@/lib/hooks/use-analytics';
import { useABTest } from '@/lib/hooks/use-ab-test';
import { Button } from '@/app/components/ui/button';
import { StatusBadge, TypeBadge } from '@/app/components/ui/badge';
import { Textarea } from '@/app/components/ui/input';
import { Skeleton } from '@/app/components/ui/skeleton';

interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  isAvailable: boolean;
  publisher?: {
    id: string;
    name: string;
    website?: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface RoleInfo {
  role: 'sponsor' | 'publisher' | null;
  sponsorId?: string;
  publisherId?: string;
  name?: string;
}

interface Props {
  id: string;
}

/**
 * Ad Slot Detail Page
 * Shows full details of an ad slot with booking functionality.
 */
export function AdSlotDetail({ id }: Props) {
  const [adSlot, setAdSlot] = useState<AdSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roleInfo, setRoleInfo] = useState<RoleInfo | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const { trackListing, trackCTA, trackBooking, trackError: trackErr } = useAnalytics();
  const ctaVariant = useABTest('cta-button-text');
  const queryClient = useQueryClient();

  const bookingMutation = useMutation({
    mutationFn: async ({ sponsorId, message }: { sponsorId: string; message?: string }) => {
      if (!adSlot) {
        throw new Error('Ad slot not available');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/ad-slots/${adSlot.id}/book`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sponsorId,
            message: message || undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to book placement');
      }

      return response.json();
    },
    onMutate: () => {
      setBooking(true);
      setBookingError(null);
    },
    onSuccess: () => {
      if (!adSlot) return;
      trackBooking({
        id: adSlot.id,
        name: adSlot.name,
        price: Number(adSlot.basePrice),
      });
      setBookingSuccess(true);
      setAdSlot({ ...adSlot, isAvailable: false });
      queryClient.invalidateQueries({ queryKey: ['adSlots'] });
      queryClient.invalidateQueries({ queryKey: ['adSlotDetail', adSlot.id] });
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : 'Failed to book placement';
      if (adSlot) {
        trackErr('booking_error', errorMessage, { listingId: adSlot.id });
      }
      setBookingError(errorMessage);
    },
    onSettled: () => {
      setBooking(false);
    },
  });

  const getCtaText = () => {
    return ctaVariant === 'B' ? 'Get Started' : 'Book Now';
  };

  useEffect(() => {
    getAdSlot(id)
      .then(setAdSlot)
      .catch(() => setError('Failed to load ad slot details'))
      .finally(() => setLoading(false));

    authClient
      .getSession()
      .then(({ data }) => {
        if (data?.user) {
          const sessionUser = data.user as User;
          setUser(sessionUser);

          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/auth/role/${sessionUser.id}`
          )
            .then((res) => res.json())
            .then((data) => setRoleInfo(data))
            .catch(() => setRoleInfo(null))
            .finally(() => setRoleLoading(false));
        } else {
          setRoleLoading(false);
        }
      })
      .catch(() => setRoleLoading(false));
  }, [id]);

  useEffect(() => {
    if (adSlot) {
      trackListing({
        id: adSlot.id,
        name: adSlot.name,
        type: adSlot.type,
        price: Number(adSlot.basePrice),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adSlot?.id, trackListing]);

  const handleBooking = async () => {
    if (!roleInfo?.sponsorId || !adSlot) return;

    trackCTA(getCtaText(), 'listing-detail-sidebar', {
      listingId: adSlot.id,
      listingPrice: Number(adSlot.basePrice),
    });

    bookingMutation.mutate({
      sponsorId: roleInfo.sponsorId,
      message,
    });
  };

  const handleOpenQuoteModal = () => {
    if (adSlot) {
      trackCTA('Request Quote', 'listing-detail', {
        listingId: adSlot.id,
        listingPrice: Number(adSlot.basePrice),
      });
    }
    setShowQuoteModal(true);
  };

  const handleUnbook = async () => {
    if (!adSlot) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/ad-slots/${adSlot.id}/unbook`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reset booking');
      }

      setBookingSuccess(false);
      setAdSlot({ ...adSlot, isAvailable: true });
      setMessage('');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to unbook:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <Skeleton height={20} width={160} className="mb-6" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-[--glass-border] bg-[--glass-strong] p-6 backdrop-blur">
              <Skeleton height={24} width={100} className="mb-4" />
              <Skeleton height={32} width="60%" className="mb-2" />
              <Skeleton height={16} width={200} className="mb-6" />
              <Skeleton height={80} width="100%" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-[--glass-border] bg-[--glass-strong] p-6 backdrop-blur">
              <Skeleton height={40} width={120} className="mx-auto mb-4" />
              <Skeleton height={48} width="100%" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !adSlot) {
    return (
      <div className="py-8">
        <Link
          href="/marketplace"
          className="mb-6 inline-flex items-center gap-2 text-[--text-sm] text-[--accent] hover:underline"
        >
          <ArrowLeftIcon /> Back to Marketplace
        </Link>
        <div className="rounded-2xl border border-[--error]/40 bg-[--error-light] p-6 text-center">
          <p className="font-semibold text-[--color-text]">{error || 'Ad slot not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Link
        href="/marketplace"
        className="mb-6 inline-flex items-center gap-2 text-[--text-sm] text-[--accent] transition-colors hover:underline"
      >
        <ArrowLeftIcon /> Back to Marketplace
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[--glass-border] bg-[--glass-strong] backdrop-blur">
            <div className="p-6">
              {/* Header */}
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <TypeBadge
                      type={
                        adSlot.type as 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST'
                      }
                    />
                    <StatusBadge status={adSlot.isAvailable ? 'available' : 'booked'} />
                  </div>
                  <h1 className="font-display text-[--text-2xl] font-semibold text-[--color-text]">
                    {adSlot.name}
                  </h1>
                  {adSlot.publisher && (
                    <p className="mt-1 text-[--text-sm] text-[--color-text-secondary]">
                      by{' '}
                      <span className="font-medium text-[--color-text]">
                        {adSlot.publisher.name}
                      </span>
                      {adSlot.publisher.website && (
                        <>
                          {' · '}
                          <a
                            href={adSlot.publisher.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[--accent] hover:underline"
                          >
                            Visit website
                          </a>
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              {adSlot.description && (
                <div className="mb-6">
                  <h2 className="mb-2 font-display text-[--text-base] font-semibold text-[--color-text]">
                    About this placement
                  </h2>
                  <p className="text-[--text-sm] leading-relaxed text-[--color-text-secondary]">
                    {adSlot.description}
                  </p>
                </div>
              )}

              {/* Metrics */}
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <MetricCard value="25K+" label="Monthly Impressions" />
                <MetricCard value="4.8%" label="Avg Click Rate" />
                <MetricCard value="85%" label="Audience Match" />
              </div>

              {/* Trust Signals */}
              <div className="rounded-xl border border-[--glass-border] bg-[--glass] p-4">
                <h3 className="mb-3 font-display text-[--text-sm] font-semibold text-[--color-text]">
                  Why sponsors love this placement
                </h3>
                <div className="space-y-2 text-[--text-sm] text-[--color-text-secondary]">
                  <TrustItem>Verified publisher with 2+ years on platform</TrustItem>
                  <TrustItem>High engagement audience in target demographic</TrustItem>
                  <TrustItem>Flexible campaign durations available</TrustItem>
                  <TrustItem>Detailed analytics and reporting included</TrustItem>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="rounded-2xl border border-[--glass-border] bg-[--glass-strong] p-6 backdrop-blur">
            <h2 className="mb-4 font-display text-[--text-lg] font-semibold text-[--color-text]">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <FAQItem question="How long does it take to get started?">
                Most placements go live within 24-48 hours after booking confirmation and creative
                approval.
              </FAQItem>
              <FAQItem question="Can I cancel or modify my booking?">
                Yes, you can modify or cancel with 7 days notice. Contact us for custom
                arrangements.
              </FAQItem>
              <FAQItem question="What reporting do I get?">
                Weekly reports with impressions, clicks, CTR, and audience insights. Real-time
                dashboard access included.
              </FAQItem>
            </div>
          </div>
        </div>

        {/* Sidebar - Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-[--glass-border] bg-[--glass-strong] p-6 shadow-float backdrop-blur">
            {/* Price */}
            <div className="mb-6 text-center">
              <p className="font-display text-[--text-3xl] font-bold text-[--color-text]">
                ${Number(adSlot.basePrice).toLocaleString()}
              </p>
              <p className="text-[--text-sm] text-[--color-text-muted]">per month</p>
            </div>

            {bookingSuccess ? (
              <div className="rounded-xl border border-[--success]/40 bg-[--success-light] p-4">
                <h3 className="font-semibold text-[--color-text]">Booked!</h3>
                <p className="mt-1 text-[--text-sm] text-[--color-text-secondary]">
                  Your request has been submitted. The publisher will contact you soon.
                </p>
                <button
                  onClick={handleUnbook}
                  className="mt-3 text-[--text-sm] text-[--color-text-secondary] underline hover:text-[--color-text]"
                >
                  Reset for testing
                </button>
              </div>
            ) : adSlot.isAvailable ? (
              <>
                {roleLoading ? (
                  <div className="py-4 text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[--accent] border-t-transparent" />
                  </div>
                ) : roleInfo?.role === 'sponsor' && roleInfo?.sponsorId ? (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-[--glass-border] bg-[--color-bg-subtle] p-3">
                      <p className="text-[--text-xs] text-[--color-text-muted]">Booking as</p>
                      <p className="font-semibold text-[--color-text]">
                        {roleInfo.name || user?.name}
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="mb-1 block text-[--text-sm] font-medium text-[--color-text]"
                      >
                        Message (optional)
                      </label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share your campaign goals..."
                        rows={3}
                      />
                    </div>
                    {bookingError && (
                      <p className="text-[--text-sm] text-[--error]">{bookingError}</p>
                    )}
                    <Button
                      onClick={handleBooking}
                      isLoading={booking}
                      className="w-full"
                      size="lg"
                    >
                      {getCtaText()}
                    </Button>
                    <Divider />
                    <Button variant="secondary" onClick={handleOpenQuoteModal} className="w-full">
                      Request Custom Quote
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Link href="/login">
                      <Button className="w-full" size="lg">
                        Log in to Book
                      </Button>
                    </Link>
                    <Divider />
                    <Button variant="secondary" onClick={handleOpenQuoteModal} className="w-full">
                      Request Quote (No Login)
                    </Button>
                    <p className="text-center text-[--text-xs] text-[--color-text-muted]">
                      Get custom pricing without creating an account
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-[--warning]/40 bg-[--warning-light] p-4 text-center">
                  <p className="font-semibold text-[--color-text]">Currently Booked</p>
                  <p className="mt-1 text-[--text-sm] text-[--color-text-secondary]">
                    Request a quote to get notified when available
                  </p>
                </div>
                <Button onClick={handleOpenQuoteModal} className="w-full">
                  Request Quote
                </Button>
                <button
                  onClick={handleUnbook}
                  className="w-full text-[--text-sm] text-[--color-text-muted] hover:underline"
                >
                  Reset listing (demo)
                </button>
              </div>
            )}

            {/* Social Proof */}
            <div className="mt-6 space-y-2 border-t border-[--glass-border] pt-4 text-center text-[--text-xs] text-[--color-text-muted]">
              <p>3 sponsors viewed this today</p>
              <p>Usually books within 48 hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Request Quote Modal */}
      {showQuoteModal && adSlot && (
        <RequestQuoteModal
          adSlotId={adSlot.id}
          adSlotName={adSlot.name}
          adSlotPrice={Number(adSlot.basePrice)}
          onClose={() => setShowQuoteModal(false)}
        />
      )}
    </div>
  );
}

// Helper components
function ArrowLeftIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-[--glass-border] bg-[--color-bg-subtle] p-4">
      <p className="font-display text-[--text-xl] font-bold text-[--color-text]">{value}</p>
      <p className="text-[--text-sm] text-[--color-text-muted]">{label}</p>
    </div>
  );
}

function TrustItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <CheckIcon />
      <span>{children}</span>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-[--success]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function FAQItem({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer items-center justify-between text-[--text-sm] font-semibold text-[--color-text]">
        {question}
        <ChevronIcon />
      </summary>
      <p className="mt-2 text-[--text-sm] text-[--color-text-secondary]">{children}</p>
    </details>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="h-4 w-4 transition-transform group-open:rotate-180"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function Divider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[--glass-border]" />
      </div>
      <div className="relative flex justify-center text-[--text-xs]">
        <span className="rounded-full bg-[--glass-strong] px-2 text-[--color-text-muted]">or</span>
      </div>
    </div>
  );
}
