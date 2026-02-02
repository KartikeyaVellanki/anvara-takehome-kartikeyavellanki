'use client';

import { useState } from 'react';
import type { Campaign } from '@/lib/types';
import { CampaignForm } from './campaign-form';
import { DeleteCampaignButton } from './delete-campaign-button';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface CampaignCardProps {
  campaign: Campaign;
}

type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';

const statusVariants: Record<CampaignStatus, 'default' | 'success' | 'warning' | 'accent'> = {
  DRAFT: 'default',
  ACTIVE: 'success',
  PAUSED: 'warning',
  COMPLETED: 'accent',
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const progress =
    campaign.budget > 0 ? (Number(campaign.spent) / Number(campaign.budget)) * 100 : 0;

  const status = campaign.status as CampaignStatus;

  return (
    <>
      <div className="group rounded-2xl border border-[--glass-border] bg-[--glass-strong] p-5 backdrop-blur transition-colors duration-[--transition-base] hover:border-[--accent]/60">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="font-display text-[--text-base] font-semibold text-[--color-text] transition-colors group-hover:text-[--accent]">
            {campaign.name}
          </h3>
          <Badge variant={statusVariants[status]} dot>
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </Badge>
        </div>

        {/* Description */}
        {campaign.description && (
          <p className="mb-4 text-[--text-sm] leading-relaxed text-[--color-text-secondary] line-clamp-2">
            {campaign.description}
          </p>
        )}

        {/* Budget Progress */}
        <div className="mb-4 rounded-xl border border-[--glass-border] bg-[--color-bg-subtle] p-3">
          <div className="mb-2 flex justify-between text-[--text-sm]">
            <span className="text-[--color-text-muted]">Budget</span>
            <span className="font-medium text-[--color-text]">
              ${Number(campaign.spent).toLocaleString()}
              <span className="text-[--color-text-muted]">
                {' '}
                / ${Number(campaign.budget).toLocaleString()}
              </span>
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[--color-border]/70">
            <div
              className="h-full bg-[--accent] transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="mt-1.5 text-right text-[--text-xs] text-[--color-text-muted]">
            {progress.toFixed(0)}% utilized
          </p>
        </div>

        {/* Dates */}
        <div className="mb-4 flex items-center gap-2 text-[--text-sm] text-[--color-text-secondary]">
          <CalendarIcon />
          <span>
            {new Date(campaign.startDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}{' '}
            &ndash;{' '}
            {new Date(campaign.endDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-[--glass-border] pt-4">
          <Button variant="ghost" size="sm" onClick={() => setShowEditForm(true)}>
            Edit
          </Button>
          <DeleteCampaignButton campaignId={campaign.id} campaignName={campaign.name} />
        </div>
      </div>

      {showEditForm && <CampaignForm campaign={campaign} onClose={() => setShowEditForm(false)} />}
    </>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}
