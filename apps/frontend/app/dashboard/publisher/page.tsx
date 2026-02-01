import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { AdSlotList } from './components/ad-slot-list';
import type { AdSlot } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

// Server-side data fetching for ad slots
async function getAdSlots(publisherId: string): Promise<AdSlot[]> {
  try {
    const res = await fetch(`${API_URL}/api/ad-slots?publisherId=${publisherId}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch ad slots');
    }
    return res.json();
  } catch {
    return [];
  }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Ad Slots</h1>
        {/* TODO: Add CreateAdSlotButton here */}
      </div>

      <AdSlotList adSlots={adSlots} />
    </div>
  );
}
