import { AdSlotGrid } from './components/ad-slot-grid';
import { NewsletterSignup } from './components/newsletter-signup';

export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-r from-[--color-primary] to-[--color-secondary] p-8 text-white">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold">Find Your Perfect Ad Placement</h1>
          <p className="mt-2 text-lg text-white/90">
            Browse premium ad slots from verified publishers. Book instantly or request custom quotes.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <span>✓</span> Verified Publishers
            </span>
            <span className="flex items-center gap-1">
              <span>✓</span> Instant Booking
            </span>
            <span className="flex items-center gap-1">
              <span>✓</span> Custom Quotes Available
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Ad Slot Grid */}
        <div className="flex-1">
          <AdSlotGrid />
        </div>

        {/* Sidebar */}
        <aside className="w-full space-y-6 lg:w-80 lg:flex-shrink-0">
          {/* Newsletter Signup */}
          <NewsletterSignup />

          {/* Quick Stats */}
          <div className="rounded-xl border border-[--color-border] bg-white p-5 dark:bg-slate-800">
            <h3 className="mb-4 font-semibold">Why Choose Anvara?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  🛡️
                </span>
                <div>
                  <p className="font-medium">Verified Publishers</p>
                  <p className="text-[--color-muted]">All partners are vetted</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  ⚡
                </span>
                <div>
                  <p className="font-medium">Instant Booking</p>
                  <p className="text-[--color-muted]">Book in seconds</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  💬
                </span>
                <div>
                  <p className="font-medium">Custom Quotes</p>
                  <p className="text-[--color-muted]">Negotiate pricing</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
