'use client';

import { useState } from 'react';
import type { Campaign } from '@/lib/types';
import { CampaignForm } from './campaign-form';
import { DeleteCampaignButton } from './delete-campaign-button';

interface CampaignCardProps {
  campaign: Campaign;
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
  PAUSED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400',
  COMPLETED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
};

const statusIcons: Record<string, string> = {
  DRAFT: '📝',
  ACTIVE: '🚀',
  PAUSED: '⏸️',
  COMPLETED: '✅',
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const progress =
    campaign.budget > 0 ? (Number(campaign.spent) / Number(campaign.budget)) * 100 : 0;

  return (
    <>
      <div className="group rounded-xl border border-[--color-border] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <h3 className="font-semibold text-[--color-foreground] transition-colors group-hover:text-[--color-primary]">
            {campaign.name}
          </h3>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[campaign.status] || 'bg-gray-100'}`}
          >
            <span>{statusIcons[campaign.status]}</span>
            {campaign.status}
          </span>
        </div>

        {/* Description */}
        {campaign.description && (
          <p className="mb-4 text-sm leading-relaxed text-[--color-muted] line-clamp-2">
            {campaign.description}
          </p>
        )}

        {/* Budget Progress */}
        <div className="mb-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-[--color-muted]">Budget Progress</span>
            <span className="font-medium">
              ${Number(campaign.spent).toLocaleString()}{' '}
              <span className="text-[--color-muted]">
                / ${Number(campaign.budget).toLocaleString()}
              </span>
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-600">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[--color-primary] to-[--color-primary-light] transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs text-[--color-muted]">
            {progress.toFixed(1)}% used
          </p>
        </div>

        {/* Dates */}
        <div className="mb-4 flex items-center gap-2 text-sm text-[--color-muted]">
          <span>📅</span>
          <span>
            {new Date(campaign.startDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}{' '}
            -{' '}
            {new Date(campaign.endDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-[--color-border] pt-4">
          <button
            onClick={() => setShowEditForm(true)}
            className="rounded-lg bg-[--color-primary]/10 px-4 py-2 text-sm font-medium text-[--color-primary] transition-colors hover:bg-[--color-primary]/20"
          >
            Edit
          </button>
          <DeleteCampaignButton campaignId={campaign.id} campaignName={campaign.name} />
        </div>
      </div>

      {showEditForm && <CampaignForm campaign={campaign} onClose={() => setShowEditForm(false)} />}
    </>
  );
}
