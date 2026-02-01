import { AdSlotGrid } from './components/ad-slot-grid';
import { NewsletterSignup } from './components/newsletter-signup';

/**
 * Marketplace Page
 * 
 * Clean, grid-based layout for browsing ad slots.
 * Swiss minimalist design with clear hierarchy.
 */
export default function MarketplacePage() {
  return (
    <div className="py-8">
      {/* Page Header */}
      <header className="mb-10">
        <h1 className="font-display text-[--text-3xl] font-semibold text-[--color-text]">
          Marketplace
        </h1>
        <p className="mt-2 text-[--text-lg] text-[--color-text-secondary]">
          Browse premium ad slots from verified publishers
        </p>
      </header>

      {/* Main Content */}
      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Ad Slot Grid */}
        <div className="flex-1 min-w-0">
          <AdSlotGrid />
        </div>

        {/* Sidebar */}
        <aside className="w-full space-y-6 lg:w-72 lg:flex-shrink-0">
          {/* Newsletter Signup */}
          <NewsletterSignup />

          {/* Features */}
          <div className="border border-[--color-border] bg-[--color-bg-elevated] p-5">
            <h3 className="mb-4 font-display text-[--text-sm] font-semibold uppercase tracking-wide text-[--color-text]">
              Why Anvara
            </h3>
            <div className="space-y-4">
              <FeatureItem
                icon={<ShieldIcon />}
                title="Verified Publishers"
                description="All partners vetted"
              />
              <FeatureItem
                icon={<BoltIcon />}
                title="Instant Booking"
                description="Book in seconds"
              />
              <FeatureItem
                icon={<ChatIcon />}
                title="Custom Quotes"
                description="Negotiate pricing"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 items-center justify-center border border-[--color-border] text-[--color-text-secondary]">
        {icon}
      </div>
      <div>
        <p className="text-[--text-sm] font-medium text-[--color-text]">{title}</p>
        <p className="text-[--text-xs] text-[--color-text-muted]">{description}</p>
      </div>
    </div>
  );
}

// Icons
function ShieldIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
