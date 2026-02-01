import { CampaignCard } from './campaign-card';
import type { Campaign } from '@/lib/types';

interface CampaignListProps {
  campaigns: Campaign[];
}

// Empty state component with visual appeal and clear CTA
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[--color-border] bg-slate-50/50 py-16 text-center dark:bg-slate-800/30">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-4xl dark:bg-indigo-900/50">
        📢
      </div>
      <h3 className="mb-2 text-xl font-semibold">No campaigns yet</h3>
      <p className="mb-6 max-w-sm text-[--color-muted]">
        Create your first campaign to start reaching your target audience through premium
        publishers.
      </p>
      <div className="text-sm text-[--color-muted]">
        Click &quot;Create Campaign&quot; above to get started
      </div>
    </div>
  );
}

// Server Component - receives data as props from parent
export function CampaignList({ campaigns }: CampaignListProps) {
  if (campaigns.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
