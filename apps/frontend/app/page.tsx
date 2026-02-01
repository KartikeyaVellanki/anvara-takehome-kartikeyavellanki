import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anvara - Connect Sponsors with Premium Publishers',
  description:
    'The modern sponsorship marketplace. Sponsors find engaged audiences, publishers monetize content. Start growing your brand or revenue today.',
};

// Feature data for the features section
const sponsorFeatures = [
  {
    icon: '🎯',
    title: 'Targeted Reach',
    description: 'Connect with publishers whose audiences match your ideal customer profile.',
  },
  {
    icon: '📊',
    title: 'Campaign Analytics',
    description: 'Track impressions, clicks, and conversions with real-time dashboards.',
  },
  {
    icon: '💰',
    title: 'Flexible Budgets',
    description: 'Set your own budget and only pay for the placements that work for you.',
  },
];

const publisherFeatures = [
  {
    icon: '💵',
    title: 'Monetize Content',
    description: 'Turn your audience into revenue with premium sponsorship opportunities.',
  },
  {
    icon: '🛡️',
    title: 'Full Control',
    description: 'Approve every sponsor and set your own rates for each ad slot.',
  },
  {
    icon: '📈',
    title: 'Grow Revenue',
    description: 'Access a network of sponsors actively looking for quality publishers.',
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
  { value: '$2M+', label: 'Sponsorships Facilitated' },
  { value: '10K+', label: 'Campaigns Launched' },
  { value: '98%', label: 'Satisfaction Rate' },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
            The Modern Sponsorship Marketplace
          </span>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Connect Brands with
            <span className="bg-gradient-to-r from-[--color-primary] to-[--color-secondary] bg-clip-text text-transparent">
              {' '}
              Premium Publishers
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[--color-muted] sm:text-xl">
            Anvara brings sponsors and publishers together. Find the perfect audience for your brand
            or monetize your content with quality sponsorships.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/marketplace"
              className="w-full rounded-lg bg-[--color-primary] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-[--color-primary-hover] hover:shadow-xl hover:shadow-indigo-500/30 sm:w-auto"
            >
              Explore Marketplace
            </Link>
            <Link
              href="/login"
              className="w-full rounded-lg border-2 border-[--color-border] bg-white px-8 py-4 text-lg font-semibold transition-all hover:border-[--color-primary] hover:text-[--color-primary] sm:w-auto dark:bg-slate-800"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-[--color-border] bg-slate-50 py-12 dark:bg-slate-800/50">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-[--color-primary] sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-[--color-muted]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section - Sponsors */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-[--color-primary]">
              For Sponsors
            </span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Reach Your Ideal Audience</h2>
            <p className="mx-auto max-w-2xl text-[--color-muted]">
              Launch campaigns that connect with engaged audiences through trusted publishers.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {sponsorFeatures.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-2xl border border-[--color-border] bg-white p-6 transition-all hover:border-[--color-primary]/50 hover:shadow-lg dark:bg-slate-800"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl transition-transform group-hover:scale-110 dark:bg-indigo-900/50">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-[--color-muted]">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Publishers */}
      <section className="bg-slate-50 py-16 sm:py-24 dark:bg-slate-800/50">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-[--color-secondary]">
              For Publishers
            </span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Monetize Your Audience</h2>
            <p className="mx-auto max-w-2xl text-[--color-muted]">
              Turn your content into revenue with sponsorships from quality brands.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {publisherFeatures.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-2xl border border-[--color-border] bg-white p-6 transition-all hover:border-[--color-secondary]/50 hover:shadow-lg dark:bg-slate-800"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl transition-transform group-hover:scale-110 dark:bg-emerald-900/50">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-[--color-muted]">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-[--color-muted]">
              Simple Process
            </span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-[--color-muted]">
              Get started in three simple steps. No complex setup required.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[--color-primary] to-[--color-secondary] text-2xl font-bold text-white shadow-lg">
                  {item.step}
                </div>
                {item.step < 3 && (
                  <div className="absolute left-[60%] top-8 hidden h-0.5 w-[80%] bg-gradient-to-r from-[--color-primary]/50 to-transparent sm:block" />
                )}
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-[--color-muted]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[--color-primary] to-indigo-700 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to Get Started?</h2>
          <p className="mb-8 text-lg text-indigo-100">
            Join thousands of sponsors and publishers already growing with Anvara.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="w-full rounded-lg bg-white px-8 py-4 text-lg font-semibold text-[--color-primary] shadow-lg transition-all hover:bg-indigo-50 sm:w-auto"
            >
              Create Free Account
            </Link>
            <Link
              href="/marketplace"
              className="w-full rounded-lg border-2 border-white/30 px-8 py-4 text-lg font-semibold transition-all hover:border-white hover:bg-white/10 sm:w-auto"
            >
              View Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[--color-border] py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-2xl font-bold text-[--color-primary]">Anvara</div>
            <p className="text-sm text-[--color-muted]">
              &copy; {new Date().getFullYear()} Anvara. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
