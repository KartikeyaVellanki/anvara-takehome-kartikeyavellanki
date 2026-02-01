import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { AdSlotList } from './components/ad-slot-list';
import { CreateAdSlotButton } from './components/create-ad-slot-button';
import type { AdSlot } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

// Server-side data fetching for ad slots
async function getAdSlots(publisherId: string): Promise<AdSlot[]> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('better-auth.session_token');

    const res = await fetch(`${API_URL}/api/ad-slots?publisherId=${publisherId}`, {
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

// Calculate dashboard stats from ad slots
function calculateStats(adSlots: AdSlot[]) {
  const totalSlots = adSlots.length;
  const availableSlots = adSlots.filter((s) => s.isAvailable).length;
  const bookedSlots = adSlots.filter((s) => !s.isAvailable).length;
  const totalRevenue = adSlots
    .filter((s) => !s.isAvailable)
    .reduce((sum, s) => sum + Number(s.basePrice), 0);

  return { totalSlots, availableSlots, bookedSlots, totalRevenue };
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

export default async function PublisherDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify user has 'publisher' role
  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== 'publisher' || !roleData.publisherId) {
    redirect('/');
  }

  // Fetch ad slots on the server
  const adSlots = await getAdSlots(roleData.publisherId);
  const stats = calculateStats(adSlots);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Ad Slots</h1>
          <p className="text-[--color-muted]">Manage your advertising inventory</p>
        </div>
        <CreateAdSlotButton />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Ad Slots"
          value={stats.totalSlots.toString()}
          icon="📦"
          color="bg-indigo-100 dark:bg-indigo-900/50"
        />
        <StatCard
          label="Available"
          value={stats.availableSlots.toString()}
          icon="✅"
          color="bg-green-100 dark:bg-green-900/50"
        />
        <StatCard
          label="Booked"
          value={stats.bookedSlots.toString()}
          icon="🔒"
          color="bg-amber-100 dark:bg-amber-900/50"
        />
        <StatCard
          label="Monthly Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon="💵"
          color="bg-emerald-100 dark:bg-emerald-900/50"
        />
      </div>

      {/* Ad Slots Section */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">All Ad Slots</h2>
        <AdSlotList adSlots={adSlots} />
      </div>
    </div>
  );
}
