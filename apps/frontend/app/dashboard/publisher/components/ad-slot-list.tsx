import { AdSlotCard } from './ad-slot-card';
import { EmptyState, EmptyStateIcons } from '@/app/components/ui/empty-state';
import type { AdSlot } from '@/lib/types';

interface AdSlotListProps {
  adSlots: AdSlot[];
}

/**
 * Ad Slot List Component
 * 
 * Displays ad slots in a grid layout.
 * Server Component - receives data as props from parent.
 */
export function AdSlotList({ adSlots }: AdSlotListProps) {
  if (adSlots.length === 0) {
    return (
      <EmptyState
        icon={EmptyStateIcons.folder}
        title="No ad slots yet"
        description="Create your first ad slot to start monetizing your audience with quality sponsorships."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {adSlots.map((slot) => (
        <AdSlotCard key={slot.id} adSlot={slot} />
      ))}
    </div>
  );
}
