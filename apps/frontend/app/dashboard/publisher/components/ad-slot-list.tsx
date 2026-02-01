import { AdSlotCard } from './ad-slot-card';
import type { AdSlot } from '@/lib/types';

interface AdSlotListProps {
  adSlots: AdSlot[];
}

// Empty state component with visual appeal and clear CTA
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[--color-border] bg-slate-50/50 py-16 text-center dark:bg-slate-800/30">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-4xl dark:bg-emerald-900/50">
        💵
      </div>
      <h3 className="mb-2 text-xl font-semibold">No ad slots yet</h3>
      <p className="mb-6 max-w-sm text-[--color-muted]">
        Create your first ad slot to start monetizing your audience with quality sponsorships.
      </p>
      <div className="text-sm text-[--color-muted]">
        Click &quot;Create Ad Slot&quot; above to get started
      </div>
    </div>
  );
}

// Server Component - receives data as props from parent
export function AdSlotList({ adSlots }: AdSlotListProps) {
  if (adSlots.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {adSlots.map((slot) => (
        <AdSlotCard key={slot.id} adSlot={slot} />
      ))}
    </div>
  );
}
