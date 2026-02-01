import type { Metadata } from 'next';
import './globals.css';
import { Nav } from './components/nav';
import { GoogleAnalyticsProvider } from './components/google-analytics';
import { AnalyticsProvider } from './components/analytics-provider';
import { ABTestDebugPanel } from './components/ab-test-debug-panel';

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
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anvara Sponsorship Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anvara - Sponsorship Marketplace',
    description:
      'Connect with premium publishers and sponsors. The modern marketplace for sponsorships.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {/* Google Analytics 4 - loads script and tracks page views */}
        <GoogleAnalyticsProvider />

        {/* Analytics Provider - handles page tracking and user identification */}
        <AnalyticsProvider>
          <Nav />
          <main className="mx-auto max-w-6xl p-4">{children}</main>
        </AnalyticsProvider>

        {/* A/B Test Debug Panel - visible in development or with ?ab_panel=true */}
        <ABTestDebugPanel />
      </body>
    </html>
  );
}
