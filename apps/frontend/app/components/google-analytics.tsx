/**
 * Google Analytics 4 (GA4) Component
 *
 * Uses the official @next/third-parties package for optimized GA4 integration.
 * This package is maintained by the Next.js team and provides:
 * - Optimized script loading (loads after hydration)
 * - Automatic page view tracking on route changes
 * - sendGAEvent helper for custom events
 *
 * @see https://nextjs.org/docs/app/guides/third-party-libraries#google-analytics
 * @see https://developers.google.com/analytics/devguides/collection/ga4/events
 *
 * Usage:
 * 1. Set NEXT_PUBLIC_GA_MEASUREMENT_ID in your .env file
 * 2. Add <GoogleAnalyticsProvider /> to your root layout.tsx
 *
 * @example
 * // In layout.tsx
 * import { GoogleAnalyticsProvider } from './components/google-analytics';
 *
 * <body>
 *   <GoogleAnalyticsProvider />
 *   {children}
 * </body>
 *
 * @example
 * // Sending custom events
 * import { sendGAEvent } from '@next/third-parties/google';
 *
 * sendGAEvent('event', 'button_click', { value: 'xyz' });
 */

import { GoogleAnalytics } from '@next/third-parties/google';

// Re-export sendGAEvent for convenience
export { sendGAEvent } from '@next/third-parties/google';

interface GoogleAnalyticsProviderProps {
  measurementId?: string;
}

/**
 * Google Analytics Provider Component
 *
 * Wraps the @next/third-parties GoogleAnalytics component with
 * environment variable support and development logging.
 *
 * The component automatically:
 * - Loads the GA4 script after hydration (performance optimized)
 * - Tracks page views on client-side navigation
 * - Handles browser history changes
 */
export function GoogleAnalyticsProvider({ measurementId }: GoogleAnalyticsProviderProps) {
  // Use prop or environment variable for measurement ID
  const gaId = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Don't render if no measurement ID is configured
  if (!gaId) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(
        '[GA4] No measurement ID provided. Set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env'
      );
    }
    return null;
  }

  // Log initialization in development
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[GA4] Initialized with:', gaId);
  }

  // Use the official @next/third-parties GoogleAnalytics component
  // It handles script loading, page views, and SPA navigation automatically
  return <GoogleAnalytics gaId={gaId} />;
}
