'use client';

import { Suspense, type ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { trackPageView, setUserProperties } from '@/lib/analytics';
import { authClient } from '@/auth-client';

/**
 * Analytics Page Tracker Component
 *
 * Handles automatic page view tracking on route changes.
 * Wrapped in Suspense due to useSearchParams requirement.
 */
function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Construct full path with search params
    const search = searchParams?.toString();
    const fullPath = search ? `${pathname}?${search}` : pathname;

    // Track page view
    trackPageView({
      path: fullPath,
      title: typeof document !== 'undefined' ? document.title : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    });
  }, [pathname, searchParams]);

  return null;
}

/**
 * User Identification Component
 *
 * Sets user properties in analytics when user session is available.
 */
function UserIdentifier() {
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const user = session?.user;
    if (user) {
      // Set user properties for analytics
      // Note: We use a hashed ID, not PII
      setUserProperties(user.id, {
        // Additional properties can be added here
        // role will be set separately when fetched
      });
    }
  }, [session?.user]);

  return null;
}

/**
 * Analytics Provider Component
 *
 * Wraps the application to provide:
 * - Automatic page view tracking on route changes
 * - User identification when logged in
 * - Global analytics context
 *
 * @example
 * // In layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AnalyticsProvider>
 *           {children}
 *         </AnalyticsProvider>
 *       </body>
 *     </html>
 *   );
 * }
 */
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Page tracking with Suspense for useSearchParams */}
      <Suspense fallback={null}>
        <PageTracker />
      </Suspense>

      {/* User identification */}
      <UserIdentifier />

      {/* Render children */}
      {children}
    </>
  );
}
