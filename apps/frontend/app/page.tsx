import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from './components/ui/button';

export const metadata: Metadata = {
  title: 'Anvara - Connect Sponsors with Premium Publishers',
  description:
    'The modern sponsorship marketplace. Sponsors find engaged audiences, publishers monetize content. Start growing your brand or revenue today.',
};

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

const heroHighlights = [
  {
    label: 'Match Engine',
    description: 'Explainable similarity scores across audience and category.',
  },
  {
    label: 'Pipeline',
    description: 'Track sponsorship velocity, approvals, and ROI signals.',
  },
  {
    label: 'Automation',
    description: 'Launch placements and reporting workflows in minutes.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-20 py-10 sm:py-16">
      {/* Hero */}
      <section className="relative">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-[--glass-border] bg-[--glass] px-4 py-2 text-[--text-xs] font-semibold uppercase tracking-[0.2em] text-[--color-text-secondary]">
              Sponsorship Marketplace
            </div>
            <h1 className="font-display text-4xl text-[--color-text] sm:text-5xl">
              Connect Brands with{' '}
              <span className="text-[--accent]">Premium Publishers</span>
            </h1>
            <p className="text-lg text-[--color-text-secondary]">
              Anvara brings sponsors and publishers together. Find the perfect audience for your brand
              or monetize your content with quality sponsorships.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/marketplace">
                <Button size="lg">Explore Marketplace</Button>
              </Link>
              <Link href="/login">
                <Button variant="outlined" size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {heroHighlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[--glass-border] bg-[--glass] p-4 text-sm text-[--color-text-secondary] backdrop-blur-xl"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[--color-text-secondary]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-[--color-text]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[--glass-border] bg-[--glass-strong] p-6 shadow-float backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[--glass-border] bg-[--glass] p-4 backdrop-blur-xl"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[--color-text-secondary]">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-[--color-text]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-[--glass-border] pt-4 text-xs text-[--color-text-muted]">
              Performance metrics based on the last 90 days of marketplace activity.
            </div>
          </div>
        </div>
      </section>

      {/* Features - Sponsors */}
      <section>
        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <p className="mb-3 text-[--text-label-large] font-semibold uppercase tracking-widest text-[--accent]">
              For Sponsors
            </p>
            <h2 className="text-[--text-headline-large] font-semibold text-[--color-text]">
              Reach Your Ideal Audience
            </h2>
            <p className="mt-4 max-w-2xl text-[--text-body-large] text-[--color-text-secondary]">
              Launch campaigns that connect with engaged audiences through trusted publishers.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {sponsorFeatures.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-2xl border border-[--glass-border] bg-[--glass] p-6 backdrop-blur-xl transition-all duration-200 ease-out hover:border-[--accent]/60"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[--accent]/15 text-[--accent]">
                  <feature.icon />
                </div>
                <h3 className="mb-2 text-[--text-title-large] font-semibold text-[--color-text]">
                  {feature.title}
                </h3>
                <p className="text-[--text-body-medium] leading-relaxed text-[--color-text-secondary]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Publishers */}
      <section>
        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <p className="mb-3 text-[--text-label-large] font-semibold uppercase tracking-widest text-[--accent-2]">
              For Publishers
            </p>
            <h2 className="text-[--text-headline-large] font-semibold text-[--color-text]">
              Monetize Your Audience
            </h2>
            <p className="mt-4 max-w-2xl text-[--text-body-large] text-[--color-text-secondary]">
              Turn your content into revenue with sponsorships from quality brands.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {publisherFeatures.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-2xl border border-[--glass-border] bg-[--glass-strong] p-6 backdrop-blur-xl transition-all duration-200 ease-out hover:border-[--accent-2]/60"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[--accent-2]/15 text-[--accent-2]">
                  <feature.icon />
                </div>
                <h3 className="mb-2 text-[--text-title-large] font-semibold text-[--color-text]">
                  {feature.title}
                </h3>
                <p className="text-[--text-body-medium] leading-relaxed text-[--color-text-secondary]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[--text-label-large] font-semibold uppercase tracking-widest text-[--color-text-secondary]">
              Simple Process
            </p>
            <h2 className="text-[--text-headline-large] font-semibold text-[--color-text]">
              How It Works
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-[--glass-border] bg-[--glass] p-6 text-center backdrop-blur-xl"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[--accent]/20 text-[--accent] font-semibold">
                  {item.step}
                </div>
                <h3 className="mb-2 text-[--text-title-large] font-semibold text-[--color-text]">
                  {item.title}
                </h3>
                <p className="text-[--text-body-medium] leading-relaxed text-[--color-text-secondary]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-[--glass-border] bg-[--glass-strong] p-10 text-center shadow-float backdrop-blur sm:p-14">
        <h2 className="text-[--text-headline-large] font-semibold text-[--color-text]">
          Ready to Get Started?
        </h2>
        <p className="mt-4 text-[--text-body-large] text-[--color-text-secondary]">
          Join thousands of sponsors and publishers already growing with Anvara.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/login">
            <Button size="lg">Create Free Account</Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="outlined" size="lg">
              View Marketplace
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="font-display text-[--text-title-large] font-semibold text-[--accent]">Anvara</div>
          <p className="text-[--text-body-medium] text-[--color-text-muted]">
            &copy; {new Date().getFullYear()} Anvara. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// SVG Icons
function TargetIcon() {
  return (
    <svg
      className="h-6 w-6"
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
      className="h-6 w-6"
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
      className="h-6 w-6"
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
      className="h-6 w-6"
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
      className="h-6 w-6"
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
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
