'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Google Analytics 4 (GA4) Component
 *
 * This component handles:
 * - Loading the GA4 script asynchronously
 * - Tracking page views on route changes (SPA navigation)
 * - Configuring the gtag instance
 *
 * Usage:
 * Add to your root layout.tsx inside the <body> tag.
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID in your environment variables.
 *
 * @example
 * // In layout.tsx
 * <body>
 *   <GoogleAnalytics />
 *   {children}
 * </body>
 */

interface GoogleAnalyticsProps {
  measurementId?: string;
}

// Note: Window.gtag and Window.dataLayer types are declared in lib/analytics.ts

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  // Use prop or environment variable
  const gaId = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views on route changes
  useEffect(() => {
    if (!gaId || typeof window.gtag !== 'function') return;

    // Construct full URL with search params
    const search = searchParams?.toString();
    const url = search ? `${pathname}?${search}` : pathname;

    // Send page view to GA4
    window.gtag('config', gaId, {
      page_path: url,
      page_title: document.title,
    });

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('[GA4] Page view:', url);
    }
  }, [pathname, searchParams, gaId]);

  // Don't render scripts if no measurement ID
  if (!gaId) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(
        '[GA4] No measurement ID provided. Set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env'
      );
    }
    return null;
  }

  return (
    <>
      {/* Load gtag.js script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />

      {/* Initialize gtag */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Configure GA4 with enhanced measurement
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              // Enable debug mode in development
              debug_mode: ${process.env.NODE_ENV === 'development'},
              // Respect user privacy
              anonymize_ip: true,
              // Cookie settings
              cookie_flags: 'SameSite=Lax;Secure',
            });

            // Log initialization in development
            ${process.env.NODE_ENV === 'development' ? "console.log('[GA4] Initialized:', '" + gaId + "');" : ''}
          `,
        }}
      />
    </>
  );
}

/**
 * Google Analytics Provider with Suspense boundary
 *
 * Use this wrapper to handle the useSearchParams Suspense requirement.
 */
import { Suspense } from 'react';

export function GoogleAnalyticsProvider({ measurementId }: GoogleAnalyticsProps) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalytics measurementId={measurementId} />
    </Suspense>
  );
}
