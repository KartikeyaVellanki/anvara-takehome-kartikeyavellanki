import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Nav } from './components/nav';
import { GoogleAnalyticsProvider } from './components/google-analytics';
import { AnalyticsProvider } from './components/analytics-provider';
import { ABTestDebugPanel } from './components/ab-test-debug-panel';
import { ThemeProvider } from './components/theme-provider';

/**
 * Typography Setup - Futuristic premium
 *
 * Manrope for body text, Space Grotesk for display.
 */
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Anvara - Sponsorship Marketplace',
    template: '%s | Anvara',
  },
  description:
    'Connect with premium publishers and sponsors. Anvara is the modern marketplace for sponsorships, helping brands reach engaged audiences and publishers monetize their content.',
  keywords: [
    'sponsorship',
    'advertising',
    'marketplace',
    'publishers',
    'sponsors',
    'ad slots',
    'campaigns',
  ],
  authors: [{ name: 'Anvara' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://anvara.com',
    siteName: 'Anvara',
    title: 'Anvara - Sponsorship Marketplace',
    description:
      'Connect with premium publishers and sponsors. The modern marketplace for sponsorships.',
  },
  twitter: {
    card: 'summary',
    title: 'Anvara - Sponsorship Marketplace',
    description:
      'Connect with premium publishers and sponsors. The modern marketplace for sponsorships.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${manrope.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[--color-bg] text-[--color-text] antialiased">
        <ThemeProvider>
          {/* Google Analytics 4 - loads script and tracks page views */}
          <GoogleAnalyticsProvider />

          {/* Analytics Provider - handles page tracking and user identification */}
          <AnalyticsProvider>
            <Nav />
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 page-fade-in">{children}</main>
          </AnalyticsProvider>

          {/* A/B Test Debug Panel - visible in development or with ?ab_panel=true */}
          <ABTestDebugPanel />
        </ThemeProvider>
      </body>
    </html>
  );
}
