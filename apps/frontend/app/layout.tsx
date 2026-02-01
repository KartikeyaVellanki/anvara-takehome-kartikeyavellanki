import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { Nav } from './components/nav';
import { GoogleAnalyticsProvider } from './components/google-analytics';
import { AnalyticsProvider } from './components/analytics-provider';
import { ABTestDebugPanel } from './components/ab-test-debug-panel';
import { ThemeProvider } from './components/theme-provider';

/**
 * Typography Setup - Material You (MD3)
 *
 * Roboto: The canonical Material Design typeface
 * - Clean, professional, highly legible
 * - Used throughout the interface
 */
const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  weight: ['400', '500', '700'],
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
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-[--md-background] text-[--md-on-background] antialiased">
        <ThemeProvider>
          {/* Google Analytics 4 - loads script and tracks page views */}
          <GoogleAnalyticsProvider />

          {/* Analytics Provider - handles page tracking and user identification */}
          <AnalyticsProvider>
            <Nav />
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</main>
          </AnalyticsProvider>

          {/* A/B Test Debug Panel - visible in development or with ?ab_panel=true */}
          <ABTestDebugPanel />
        </ThemeProvider>
      </body>
    </html>
  );
}
