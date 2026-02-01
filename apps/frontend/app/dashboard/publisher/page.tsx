import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { AdSlotList } from './components/ad-slot-list';
import { CreateAdSlotButton } from './components/create-ad-slot-button';
import type { AdSlot } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

/**
 * Server-side data fetching for ad slots
 */
async function getAdSlots(publisherId: string): Promise<AdSlot[]> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('better-auth.session_token');

    // Request all ad slots for this publisher (high limit to get all)
    const res = await fetch(`${API_URL}/api/ad-slots?publisherId=${publisherId}&limit=100`, {
      cache: 'no-store',
      headers: {
        ...(sessionCookie && { Cookie: `better-auth.session_token=${sessionCookie.value}` }),
      },
    });
    if (!res.ok) {
      return [];
    }
    // API returns { data: AdSlot[], pagination: {...} }
    const response = await res.json();
    return response.data || [];
  } catch {
    return [];
  }
}

/**
 * Calculate dashboard stats from ad slots
 */
function calculateStats(adSlots: AdSlot[]) {
  const totalSlots = adSlots.length;
  const availableSlots = adSlots.filter((s) => s.isAvailable).length;
  const bookedSlots = adSlots.filter((s) => !s.isAvailable).length;
  const totalRevenue = adSlots
    .filter((s) => !s.isAvailable)
    .reduce((sum, s) => sum + Number(s.basePrice), 0);

  return { totalSlots, availableSlots, bookedSlots, totalRevenue };
}

/**
 * Stats card component - minimal Swiss design
 */
function StatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="border border-[--color-border] bg-[--color-bg-elevated] p-5">
      <p className="text-[--text-xs] font-medium uppercase tracking-wide text-[--color-text-muted]">
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

  // Calculate occupancy rate
  const occupancyRate = stats.totalSlots > 0 
    ? Math.round((stats.bookedSlots / stats.totalSlots) * 100) 
    : 0;

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[--text-3xl] font-semibold text-[--color-text]">
            Ad Slots
          </h1>
          <p className="mt-1 text-[--color-text-secondary]">
            Manage your advertising inventory
          </p>
        </div>
        <CreateAdSlotButton />
      </div>

      {/* Stats Grid */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Slots"
          value={stats.totalSlots.toString()}
        />
        <StatCard
          label="Available"
          value={stats.availableSlots.toString()}
          subtext={`${100 - occupancyRate}% capacity`}
        />
        <StatCard
          label="Booked"
          value={stats.bookedSlots.toString()}
          subtext={`${occupancyRate}% occupancy`}
        />
        <StatCard
          label="Monthly Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          subtext="from booked slots"
        />
      </div>

      {/* Ad Slots Section */}
      <div>
        <h2 className="mb-4 font-display text-[--text-lg] font-semibold text-[--color-text]">
          All Ad Slots
        </h2>
        <AdSlotList adSlots={adSlots} />
      </div>
    </div>
  );
}
