import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { CampaignList } from './components/campaign-list';
import { CreateCampaignButton } from './components/create-campaign-button';
import type { Campaign } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

// Server-side data fetching for campaigns (with auth)
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

// Calculate dashboard stats from campaigns
function calculateStats(campaigns: Campaign[]) {
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length;
  const totalBudget = campaigns.reduce((sum, c) => sum + Number(c.budget), 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + Number(c.spent), 0);

  return { totalCampaigns, activeCampaigns, totalBudget, totalSpent };
}

// Stats card component
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-[--color-border] bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color} text-xl`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-[--color-muted]">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Campaigns</h1>
          <p className="text-[--color-muted]">Manage your advertising campaigns</p>
        </div>
        <CreateCampaignButton />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Campaigns"
          value={stats.totalCampaigns.toString()}
          icon="📊"
          color="bg-indigo-100 dark:bg-indigo-900/50"
        />
        <StatCard
          label="Active Campaigns"
          value={stats.activeCampaigns.toString()}
          icon="🚀"
          color="bg-green-100 dark:bg-green-900/50"
        />
        <StatCard
          label="Total Budget"
          value={`$${stats.totalBudget.toLocaleString()}`}
          icon="💰"
          color="bg-amber-100 dark:bg-amber-900/50"
        />
        <StatCard
          label="Total Spent"
          value={`$${stats.totalSpent.toLocaleString()}`}
          icon="📈"
          color="bg-blue-100 dark:bg-blue-900/50"
        />
      </div>

      {/* Campaigns Section */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">All Campaigns</h2>
        <CampaignList campaigns={campaigns} />
      </div>
    </div>
  );
}
