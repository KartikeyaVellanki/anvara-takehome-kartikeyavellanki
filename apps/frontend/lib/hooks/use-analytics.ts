/**
 * React Hook for Analytics Tracking
 *
 * Provides easy access to analytics functions within React components
 * with automatic page view tracking on route changes.
 */

'use client';

import { useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  trackPageView,
  trackConversion,
  trackCTAClick,
  trackListingView,
  trackFilterUse,
  trackBookingSubmit,
  trackQuoteSubmit,
  trackNewsletterSubscribe,
  trackError,
  setUserProperties,
  type ConversionEvent,
  type EventProperties,
} from '../analytics';

// ============================================================================
// PAGE VIEW TRACKING HOOK
// ============================================================================

/**
 * Hook that automatically tracks page views on route changes
 *
 * Add this to your layout or a top-level component to enable
 * automatic page view tracking for SPA navigation.
 *
 * @example
 * // In layout.tsx or a provider component
 * function AnalyticsProvider({ children }) {
 *   usePageTracking();
 *   return <>{children}</>;
 * }
 */
export function usePageTracking(): void {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Construct full path with search params
    const search = searchParams?.toString();
    const fullPath = search ? `${pathname}?${search}` : pathname;

    // Track the page view
    trackPageView({
      path: fullPath,
      title: document.title,
      referrer: document.referrer,
    });
  }, [pathname, searchParams]);
}

// ============================================================================
// MAIN ANALYTICS HOOK
// ============================================================================

/**
 * Hook providing all analytics tracking functions
 *
 * Returns memoized tracking functions that can be used directly
 * in event handlers without causing re-renders.
 *
 * @example
 * function BookingButton({ listing }) {
 *   const { trackBooking, trackCTA } = useAnalytics();
 *
 *   const handleClick = () => {
 *     trackCTA('Book Now', 'listing-detail');
 *     trackBooking(listing);
 *     // ... booking logic
 *   };
 *
 *   return <button onClick={handleClick}>Book Now</button>;
 * }
 */
export function useAnalytics() {
  // Memoize tracking functions to prevent unnecessary re-renders
  const trackCTA = useCallback(
    (buttonText: string, location: string, properties?: EventProperties) => {
      trackCTAClick(buttonText, location, properties);
    },
    []
  );

  const trackListing = useCallback(
    (listing: { id: string; name: string; type: string; price: number }) => {
      trackListingView(listing);
    },
    []
  );

  const trackFilter = useCallback((filterType: string, filterValue: string) => {
    trackFilterUse(filterType, filterValue);
  }, []);

  const trackBooking = useCallback((listing: { id: string; name: string; price: number }) => {
    trackBookingSubmit(listing);
  }, []);

  const trackQuote = useCallback((listing: { id: string; name: string; price: number }) => {
    trackQuoteSubmit(listing);
  }, []);

  const trackNewsletter = useCallback((source: string) => {
    trackNewsletterSubscribe(source);
  }, []);

  const track = useCallback((event: ConversionEvent, properties?: EventProperties) => {
    trackConversion(event, properties);
  }, []);

  const trackErr = useCallback(
    (errorType: string, errorMessage: string, properties?: EventProperties) => {
      trackError(errorType, errorMessage, properties);
    },
    []
  );

  const setUser = useCallback(
    (
      userId?: string,
      properties?: {
        role?: 'sponsor' | 'publisher';
        accountAge?: number;
        [key: string]: string | number | undefined;
      }
    ) => {
      setUserProperties(userId, properties);
    },
    []
  );

  return {
    // Specific tracking functions
    trackCTA,
    trackListing,
    trackFilter,
    trackBooking,
    trackQuote,
    trackNewsletter,
    // Generic tracking
    track,
    trackError: trackErr,
    // User identification
    setUser,
  };
}

// ============================================================================
// LISTING VIEW TRACKING HOOK
// ============================================================================

/**
 * Hook to track when a listing is viewed
 *
 * Automatically tracks the view on mount. Use this in listing detail pages.
 *
 * @param listing - The listing being viewed
 *
 * @example
 * function ListingDetail({ listing }) {
 *   useListingViewTracking({
 *     id: listing.id,
 *     name: listing.name,
 *     type: listing.type,
 *     price: listing.basePrice,
 *   });
 *
 *   return <div>...</div>;
 * }
 */
export function useListingViewTracking(
  listing: { id: string; name: string; type: string; price: number } | null
): void {
  useEffect(() => {
    if (listing) {
      trackListingView(listing);
    }
  }, [listing?.id]); // Only re-track if listing ID changes
}

// ============================================================================
// SCROLL DEPTH TRACKING HOOK
// ============================================================================

/**
 * Hook to track scroll depth milestones
 *
 * Tracks when users scroll to 25%, 50%, 75%, and 100% of the page.
 * Useful for understanding content engagement.
 *
 * @example
 * function LongContentPage() {
 *   useScrollDepthTracking();
 *   return <div>Long content...</div>;
 * }
 */
export function useScrollDepthTracking(): void {
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const trackedMilestones = new Set<number>();

    const handleScroll = () => {
      // Calculate scroll percentage
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // Track milestones
      for (const milestone of milestones) {
        if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          trackConversion('scroll_depth', {
            depth: milestone,
            path: window.location.pathname,
          });
        }
      }
    };

    // Throttle scroll handler for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);
}
