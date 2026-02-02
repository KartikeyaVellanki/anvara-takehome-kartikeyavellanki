import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { CampaignList } from './components/campaign-list';
import { CreateCampaignButton } from './components/create-campaign-button';
import type { Campaign } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

/**
 * Server-side data fetching for campaigns
 */
async function getCampaigns(): Promise<Campaign[]> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('better-auth.session_token');

    const res = await fetch(`${API_URL}/api/campaigns`, {
      cache: 'no-store',
      headers: {
        ...(sessionCookie && { Cookie: `better-auth.session_token=${sessionCookie.value}` }),
      },
    });
    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch {
    return [];
  }
}

/**
 * Calculate dashboard stats from campaigns
 */
function calculateStats(campaigns: Campaign[]) {
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length;
  const totalBudget = campaigns.reduce((sum, c) => sum + Number(c.budget), 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + Number(c.spent), 0);

  return { totalCampaigns, activeCampaigns, totalBudget, totalSpent };
}

/**
 * Stats card component - minimal Swiss design
 */
function StatCard({ label, value, subtext }: { label: string; value: string; subtext?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--glass-surface)] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <p className="text-[--text-xs] font-semibold uppercase tracking-[0.22em] text-[--color-text-muted]">
        {label}
      </p>
      <p className="mt-1 font-display text-[--text-2xl] font-semibold text-[--color-text]">
        {value}
      </p>
      {subtext && (
        <p className="mt-0.5 text-[--text-sm] text-[--color-text-secondary]">{subtext}</p>
      )}
    </div>
  );
}

export default async function SponsorDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify user has 'sponsor' role
  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== 'sponsor' || !roleData.sponsorId) {
    redirect('/');
  }

  // Fetch campaigns on the server (filtered by auth middleware)
  const campaigns = await getCampaigns();
  const stats = calculateStats(campaigns);

  // Calculate utilization percentage
  const utilization =
    stats.totalBudget > 0 ? Math.round((stats.totalSpent / stats.totalBudget) * 100) : 0;

  return (
    <div className="py-10">
      {/* Hero */}
      <header className="relative mb-10 overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--glass-surface)] backdrop-blur-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,hsl(var(--accent-hsl)/0.18),transparent_50%),radial-gradient(ellipse_at_80%_80%,hsl(var(--accent-2-hsl)/0.14),transparent_50%)]"
        />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--card-border)] bg-[var(--glass-surface-strong)] px-4 py-2 text-[--text-xs] font-semibold uppercase tracking-[0.3em] text-[--color-text-secondary]">
                <span className="h-2 w-2 rounded-full bg-[--success] shadow-[0_0_0_6px_hsl(var(--success-hsl)/0.12)]" />
                Sponsor Dashboard
              </div>
              <h1 className="font-display text-[--text-4xl] font-semibold tracking-tight text-[--color-text]">
                Campaigns
              </h1>
              <p className="mt-3 max-w-2xl text-[--text-base] text-[--color-text-secondary]">
                Manage your advertising campaigns
              </p>
            </div>
            <div className="shrink-0">
              <CreateCampaignButton />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Campaigns" value={stats.totalCampaigns.toString()} />
        <StatCard
          label="Active"
          value={stats.activeCampaigns.toString()}
          subtext={`of ${stats.totalCampaigns} campaigns`}
        />
        <StatCard label="Total Budget" value={`$${stats.totalBudget.toLocaleString()}`} />
        <StatCard
          label="Spent"
          value={`$${stats.totalSpent.toLocaleString()}`}
          subtext={`${utilization}% utilized`}
        />
      </div>

      {/* Campaigns Section */}
      <div>
        <h2 className="mb-4 font-display text-[--text-lg] font-semibold text-[--color-text]">
          All Campaigns
        </h2>
        <CampaignList campaigns={campaigns} />
      </div>
    </div>
  );
}
