import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from './components/ui/button';

export const metadata: Metadata = {
  title: 'Anvara - Connect Sponsors with Premium Publishers',
  description:
    'The modern sponsorship marketplace. Sponsors find engaged audiences, publishers monetize content. Start growing your brand or revenue today.',
};

/**
 * Feature data - no emojis, clean professional icons
 */
const sponsorFeatures = [
  {
    title: 'Targeted Reach',
    description: 'Connect with publishers whose audiences match your ideal customer profile.',
    icon: TargetIcon,
  },
  {
    title: 'Campaign Analytics',
    description: 'Track impressions, clicks, and conversions with real-time dashboards.',
    icon: ChartIcon,
  },
  {
    title: 'Flexible Budgets',
    description: 'Set your own budget and only pay for the placements that work for you.',
    icon: WalletIcon,
  },
];

const publisherFeatures = [
  {
    title: 'Monetize Content',
    description: 'Turn your audience into revenue with premium sponsorship opportunities.',
    icon: CurrencyIcon,
  },
  {
    title: 'Full Control',
    description: 'Approve every sponsor and set your own rates for each ad slot.',
    icon: ShieldIcon,
  },
  {
    title: 'Grow Revenue',
    description: 'Access a network of sponsors actively looking for quality publishers.',
    icon: TrendingIcon,
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Create Your Profile',
    description: 'Sign up as a sponsor or publisher and set up your profile in minutes.',
  },
  {
    step: 2,
    title: 'Browse the Marketplace',
    description:
      'Sponsors discover premium ad slots. Publishers list their inventory and set prices.',
  },
  {
    step: 3,
    title: 'Connect & Grow',
    description: 'Request placements, negotiate terms, and start your sponsorship partnership.',
  },
];

const stats = [
  { value: '500+', label: 'Active Publishers' },
  { value: '$2M+', label: 'Facilitated' },
  { value: '10K+', label: 'Campaigns' },
  { value: '98%', label: 'Satisfaction' },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Subtle radial background */}
        <div className="absolute inset-0 -z-10 bg-radial-light" />

        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-[--text-sm] font-medium uppercase tracking-widest text-[--accent]">
            Sponsorship Marketplace
          </p>
          <h1 className="font-display text-[--text-5xl] font-bold leading-[1.1] tracking-tight text-[--color-text] sm:text-6xl">
            Connect Brands with
            <br />
            <span className="text-[--accent]">Premium Publishers</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-[--text-lg] leading-relaxed text-[--color-text-secondary]">
            Anvara brings sponsors and publishers together. Find the perfect audience for your brand
            or monetize your content with quality sponsorships.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/marketplace">
              <Button size="lg">Explore Marketplace</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-[--color-border] py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-[--text-3xl] font-bold text-[--color-text]">
                {stat.value}
              </div>
              <div className="mt-1 text-[--text-sm] text-[--color-text-muted]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section - Sponsors */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-16">
            <p className="mb-3 text-[--text-sm] font-medium uppercase tracking-widest text-[--accent]">
              For Sponsors
            </p>
            <h2 className="font-display text-[--text-3xl] font-semibold text-[--color-text]">
              Reach Your Ideal Audience
            </h2>
            <p className="mt-4 max-w-2xl text-[--text-lg] text-[--color-text-secondary]">
              Launch campaigns that connect with engaged audiences through trusted publishers.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {sponsorFeatures.map((feature) => (
              <article
                key={feature.title}
                className="group border border-[--color-border] bg-[--color-bg-elevated] p-6 transition-colors duration-[--transition-base] hover:border-[--accent]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center border border-[--color-border] text-[--color-text-secondary] transition-colors group-hover:border-[--accent] group-hover:text-[--accent]">
                  <feature.icon />
                </div>
                <h3 className="mb-2 font-display text-[--text-base] font-semibold text-[--color-text]">
                  {feature.title}
                </h3>
                <p className="text-[--text-sm] leading-relaxed text-[--color-text-secondary]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Publishers */}
      <section className="border-y border-[--color-border] bg-[--color-bg-subtle] py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-16">
            <p className="mb-3 text-[--text-sm] font-medium uppercase tracking-widest text-[--accent]">
              For Publishers
            </p>
            <h2 className="font-display text-[--text-3xl] font-semibold text-[--color-text]">
              Monetize Your Audience
            </h2>
            <p className="mt-4 max-w-2xl text-[--text-lg] text-[--color-text-secondary]">
              Turn your content into revenue with sponsorships from quality brands.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {publisherFeatures.map((feature) => (
              <article
                key={feature.title}
                className="group border border-[--color-border] bg-[--color-bg-elevated] p-6 transition-colors duration-[--transition-base] hover:border-[--accent]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center border border-[--color-border] text-[--color-text-secondary] transition-colors group-hover:border-[--accent] group-hover:text-[--accent]">
                  <feature.icon />
                </div>
                <h3 className="mb-2 font-display text-[--text-base] font-semibold text-[--color-text]">
                  {feature.title}
                </h3>
                <p className="text-[--text-sm] leading-relaxed text-[--color-text-secondary]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-16 text-center">
            <p className="mb-3 text-[--text-sm] font-medium uppercase tracking-widest text-[--color-text-muted]">
              Simple Process
            </p>
            <h2 className="font-display text-[--text-3xl] font-semibold text-[--color-text]">
              How It Works
            </h2>
          </div>
          <div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative text-center">
                {/* Step connector line */}
                {index < howItWorks.length - 1 && (
                  <div className="absolute left-[calc(50%+40px)] top-5 hidden h-px w-[calc(100%-80px)] bg-[--color-border] sm:block" />
                )}
                <div className="mx-auto mb-6 flex h-10 w-10 items-center justify-center border-2 border-[--accent] font-display text-[--text-lg] font-semibold text-[--accent]">
                  {item.step}
                </div>
                <h3 className="mb-3 font-display text-[--text-lg] font-semibold text-[--color-text]">
                  {item.title}
                </h3>
                <p className="text-[--text-sm] leading-relaxed text-[--color-text-secondary]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-[--color-border] bg-[--gray-900] py-20 text-white sm:py-28">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-display text-[--text-3xl] font-semibold">Ready to Get Started?</h2>
          <p className="mt-4 text-[--text-lg] text-[--gray-400]">
            Join thousands of sponsors and publishers already growing with Anvara.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="bg-white text-[--gray-900] hover:bg-[--gray-100]">
                Create Free Account
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button
                variant="ghost"
                size="lg"
                className="border border-[--gray-700] text-white hover:bg-[--gray-800] hover:text-white"
              >
                View Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[--color-border] py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="font-display text-xl font-semibold text-[--color-text]">Anvara</div>
            <p className="text-[--text-sm] text-[--color-text-muted]">
              &copy; {new Date().getFullYear()} Anvara. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// SVG Icons - clean, minimal line icons
function TargetIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  );
}

function CurrencyIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
