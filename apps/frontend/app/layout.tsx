import type { Metadata } from 'next';
import './globals.css';
import { Nav } from './components/nav';

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
  // HINT: If using React Query, you would wrap children with QueryClientProvider here
  // See: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Nav />
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
