import { CampaignCard } from './campaign-card';
import { EmptyState, EmptyStateIcons } from '@/app/components/ui/empty-state';
import type { Campaign } from '@/lib/types';

interface CampaignListProps {
  campaigns: Campaign[];
}

/**
 * Campaign List Component
 * 
 * Displays campaigns in a grid layout.
 * Server Component - receives data as props from parent.
 */
export function CampaignList({ campaigns }: CampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <EmptyState
        icon={EmptyStateIcons.chart}
        title="No campaigns yet"
        description="Create your first campaign to start reaching your target audience through premium publishers."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
