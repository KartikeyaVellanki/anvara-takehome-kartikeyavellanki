'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdSlot } from '@/lib/api';
import { authClient } from '@/auth-client';
import { RequestQuoteModal } from './request-quote-modal';
import { useAnalytics } from '@/lib/hooks/use-analytics';
import { useABTest } from '@/lib/hooks/use-ab-test';

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

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  VIDEO: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  NATIVE: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  NEWSLETTER: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  PODCAST: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
};

const typeIcons: Record<string, string> = {
  DISPLAY: '🖼️',
  VIDEO: '🎬',
  NATIVE: '📱',
  NEWSLETTER: '📧',
  PODCAST: '🎙️',
};

interface Props {
  id: string;
}

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

  // Analytics hook for tracking user interactions
  const { trackListing, trackCTA, trackBooking, trackError: trackErr } = useAnalytics();

  // A/B test for CTA button text
  const ctaVariant = useABTest('cta-button-text');

  // Get CTA text based on A/B test variant
  const getCtaText = () => {
    return ctaVariant === 'B' ? '🚀 Get Started' : '🚀 Book Now';
  };

  useEffect(() => {
    // Fetch ad slot
    getAdSlot(id)
      .then(setAdSlot)
      .catch(() => setError('Failed to load ad slot details'))
      .finally(() => setLoading(false));

    // Check user session and fetch role
    authClient
      .getSession()
      .then(({ data }) => {
        if (data?.user) {
          const sessionUser = data.user as User;
          setUser(sessionUser);

          // Fetch role info from backend
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

  // Track listing view when adSlot is loaded (conversion tracking)
  useEffect(() => {
    if (adSlot) {
      trackListing({
        id: adSlot.id,
        name: adSlot.name,
        type: adSlot.type,
        price: Number(adSlot.basePrice),
      });
    }
    // Only track when listing ID changes, not on every adSlot update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adSlot?.id, trackListing]);

  const handleBooking = async () => {
    if (!roleInfo?.sponsorId || !adSlot) return;

    // Track CTA click
    trackCTA(getCtaText(), 'listing-detail-sidebar', {
      listingId: adSlot.id,
      listingPrice: Number(adSlot.basePrice),
    });

    setBooking(true);
    setBookingError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/ad-slots/${adSlot.id}/book`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sponsorId: roleInfo.sponsorId,
            message: message || undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to book placement');
      }

      // Track successful booking (macro-conversion)
      trackBooking({
        id: adSlot.id,
        name: adSlot.name,
        price: Number(adSlot.basePrice),
      });

      setBookingSuccess(true);
      setAdSlot({ ...adSlot, isAvailable: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to book placement';
      trackErr('booking_error', errorMessage, { listingId: adSlot.id });
      setBookingError(errorMessage);
    } finally {
      setBooking(false);
    }
  };

  // Handler for opening quote modal with analytics
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
      <div className="py-12 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[--color-primary] border-t-transparent" />
        <p className="mt-4 text-[--color-muted]">Loading details...</p>
      </div>
    );
  }

  if (error || !adSlot) {
    return (
      <div className="space-y-4">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-[--color-primary] hover:underline"
        >
          ← Back to Marketplace
        </Link>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-900/20">
          <span className="mb-2 block text-3xl">😕</span>
          <p className="font-medium text-red-800 dark:text-red-200">
            {error || 'Ad slot not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 text-[--color-primary] transition-colors hover:underline"
      >
        ← Back to Marketplace
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-[--color-border] bg-white shadow-sm dark:bg-slate-800">
            {/* Type Header */}
            <div
              className={`h-2 ${
                adSlot.type === 'DISPLAY'
                  ? 'bg-blue-500'
                  : adSlot.type === 'VIDEO'
                    ? 'bg-red-500'
                    : adSlot.type === 'NATIVE'
                      ? 'bg-green-500'
                      : adSlot.type === 'NEWSLETTER'
                        ? 'bg-purple-500'
                        : 'bg-orange-500'
              }`}
            />

            <div className="p-6">
              {/* Header */}
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${typeColors[adSlot.type] || 'bg-gray-100'}`}
                    >
                      {typeIcons[adSlot.type]} {adSlot.type}
                    </span>
                    {adSlot.isAvailable ? (
                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        Available
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        Booked
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold lg:text-3xl">{adSlot.name}</h1>
                  {adSlot.publisher && (
                    <p className="mt-1 text-[--color-muted]">
                      by{' '}
                      <span className="font-medium text-[--color-foreground]">
                        {adSlot.publisher.name}
                      </span>
                      {adSlot.publisher.website && (
                        <>
                          {' '}
                          ·{' '}
                          <a
                            href={adSlot.publisher.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[--color-primary] hover:underline"
                          >
                            Visit website ↗
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
                  <h2 className="mb-2 font-semibold">About this placement</h2>
                  <p className="leading-relaxed text-[--color-muted]">{adSlot.description}</p>
                </div>
              )}

              {/* Simulated Metrics - improves conversion by showing value */}
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                  <p className="text-2xl font-bold">25K+</p>
                  <p className="text-sm text-[--color-muted]">Monthly Impressions</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                  <p className="text-2xl font-bold">4.8%</p>
                  <p className="text-sm text-[--color-muted]">Avg Click Rate</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-sm text-[--color-muted]">Audience Match</p>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="rounded-xl border border-[--color-border] p-4">
                <h3 className="mb-3 font-semibold">Why sponsors love this placement</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Verified publisher with 2+ years on platform</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>High engagement audience in target demographic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Flexible campaign durations available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Detailed analytics and reporting included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section - addresses common objections */}
          <div className="mt-6 rounded-2xl border border-[--color-border] bg-white p-6 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-semibold">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between font-medium">
                  How long does it take to get started?
                  <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-2 text-sm text-[--color-muted]">
                  Most placements go live within 24-48 hours after booking confirmation and creative
                  approval.
                </p>
              </details>
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between font-medium">
                  Can I cancel or modify my booking?
                  <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-2 text-sm text-[--color-muted]">
                  Yes, you can modify or cancel with 7 days notice. Contact us for custom
                  arrangements.
                </p>
              </details>
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between font-medium">
                  What reporting do I get?
                  <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-2 text-sm text-[--color-muted]">
                  Weekly reports with impressions, clicks, CTR, and audience insights. Real-time
                  dashboard access included.
                </p>
              </details>
            </div>
          </div>
        </div>

        {/* Sidebar - Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-[--color-border] bg-white p-6 shadow-lg dark:bg-slate-800">
            {/* Price */}
            <div className="mb-6 text-center">
              <p className="text-3xl font-bold text-[--color-primary]">
                ${Number(adSlot.basePrice).toLocaleString()}
              </p>
              <p className="text-[--color-muted]">per month</p>
            </div>

            {bookingSuccess ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">🎉</span>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">Booked!</h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your request has been submitted. The publisher will contact you soon.
                </p>
                <button
                  onClick={handleUnbook}
                  className="mt-3 text-sm text-green-700 underline hover:text-green-800 dark:text-green-300"
                >
                  Reset for testing
                </button>
              </div>
            ) : adSlot.isAvailable ? (
              <>
                {roleLoading ? (
                  <div className="py-4 text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[--color-primary] border-t-transparent" />
                  </div>
                ) : roleInfo?.role === 'sponsor' && roleInfo?.sponsorId ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                      <p className="text-xs text-[--color-muted]">Booking as</p>
                      <p className="font-medium">{roleInfo.name || user?.name}</p>
                    </div>
                    <div>
                      <label htmlFor="message" className="mb-1 block text-sm font-medium">
                        Message (optional)
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share your campaign goals..."
                        className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2 text-sm dark:bg-slate-700"
                        rows={3}
                      />
                    </div>
                    {bookingError && <p className="text-sm text-red-600">{bookingError}</p>}
                    <button
                      onClick={handleBooking}
                      disabled={booking}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[--color-primary] px-4 py-3 font-semibold text-white transition-all hover:bg-[--color-primary-hover] hover:shadow-md disabled:opacity-50"
                    >
                      {booking ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Booking...
                        </>
                      ) : (
                        getCtaText()
                      )}
                    </button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[--color-border]" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-[--color-muted] dark:bg-slate-800">
                          or
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleOpenQuoteModal}
                      className="w-full rounded-lg border border-[--color-border] px-4 py-3 font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      💬 Request Custom Quote
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Link
                      href="/login"
                      className="block w-full rounded-lg bg-[--color-primary] px-4 py-3 text-center font-semibold text-white transition-all hover:bg-[--color-primary-hover] hover:shadow-md"
                    >
                      Log in to Book
                    </Link>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[--color-border]" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-[--color-muted] dark:bg-slate-800">
                          or
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleOpenQuoteModal}
                      className="w-full rounded-lg border border-[--color-border] px-4 py-3 font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      💬 Request Quote (No Login)
                    </button>
                    <p className="text-center text-xs text-[--color-muted]">
                      Get custom pricing without creating an account
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-amber-50 p-4 text-center dark:bg-amber-900/20">
                  <p className="font-medium text-amber-800 dark:text-amber-200">Currently Booked</p>
                  <p className="mt-1 text-sm text-amber-600 dark:text-amber-300">
                    Request a quote to get notified when available
                  </p>
                </div>
                <button
                  onClick={handleOpenQuoteModal}
                  className="w-full rounded-lg bg-[--color-secondary] px-4 py-3 font-semibold text-white transition-all hover:bg-[--color-secondary-hover] hover:shadow-md"
                >
                  💬 Request Quote
                </button>
                <button
                  onClick={handleUnbook}
                  className="w-full text-sm text-[--color-muted] hover:underline"
                >
                  Reset listing (demo)
                </button>
              </div>
            )}

            {/* Urgency / Social Proof */}
            <div className="mt-6 space-y-2 border-t border-[--color-border] pt-4 text-center text-xs text-[--color-muted]">
              <p>🔥 3 sponsors viewed this today</p>
              <p>⏰ Usually books within 48 hours</p>
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
