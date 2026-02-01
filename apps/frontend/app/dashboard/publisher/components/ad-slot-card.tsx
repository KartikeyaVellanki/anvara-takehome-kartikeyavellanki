'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { AdSlot } from '@/lib/types';
import { AdSlotForm } from './ad-slot-form';
import { DeleteAdSlotButton } from './delete-ad-slot-button';
import { toggleAdSlotAvailability, type ActionState } from '../actions';

interface AdSlotCardProps {
  adSlot: AdSlot;
}

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
  VIDEO: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
  NATIVE: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
  NEWSLETTER: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400',
  PODCAST: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400',
};

const typeIcons: Record<string, string> = {
  DISPLAY: '🖼️',
  VIDEO: '🎬',
  NATIVE: '📱',
  NEWSLETTER: '📧',
  PODCAST: '🎙️',
};

// Toggle button with pending state
function ToggleButton({ isAvailable }: { isAvailable: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
        isAvailable
          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-400 dark:hover:bg-amber-900/70'
          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-400 dark:hover:bg-green-900/70'
      } disabled:opacity-50`}
    >
      {pending ? (
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <span>{isAvailable ? '🔒' : '✅'}</span>
      )}
      {pending ? 'Updating...' : isAvailable ? 'Mark Booked' : 'Mark Available'}
    </button>
  );
}

const initialState: ActionState = {};

export function AdSlotCard({ adSlot }: AdSlotCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [, formAction] = useActionState(toggleAdSlotAvailability, initialState);

  return (
    <>
      <div className="group rounded-xl border border-[--color-border] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <h3 className="font-semibold text-[--color-foreground] transition-colors group-hover:text-[--color-secondary]">
            {adSlot.name}
          </h3>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${typeColors[adSlot.type] || 'bg-gray-100'}`}
          >
            <span>{typeIcons[adSlot.type]}</span>
            {adSlot.type}
          </span>
        </div>

        {/* Description */}
        {adSlot.description && (
          <p className="mb-4 text-sm leading-relaxed text-[--color-muted] line-clamp-2">
            {adSlot.description}
          </p>
        )}

        {/* Price & Status */}
        <div className="mb-4 flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-2.5 w-2.5 rounded-full ${adSlot.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
            />
            <span
              className={`text-sm font-medium ${adSlot.isAvailable ? 'text-green-600 dark:text-green-400' : 'text-[--color-muted]'}`}
            >
              {adSlot.isAvailable ? 'Available' : 'Booked'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-[--color-secondary]">
              ${Number(adSlot.basePrice).toLocaleString()}
            </span>
            <span className="text-sm text-[--color-muted]">/mo</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[--color-border] pt-4">
          <form action={formAction}>
            <input type="hidden" name="id" value={adSlot.id} />
            <input type="hidden" name="isAvailable" value={String(adSlot.isAvailable)} />
            <ToggleButton isAvailable={adSlot.isAvailable} />
          </form>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditForm(true)}
              className="rounded-lg bg-[--color-primary]/10 px-4 py-2 text-sm font-medium text-[--color-primary] transition-colors hover:bg-[--color-primary]/20"
            >
              Edit
            </button>
            <DeleteAdSlotButton adSlotId={adSlot.id} adSlotName={adSlot.name} />
          </div>
        </div>
      </div>

      {showEditForm && <AdSlotForm adSlot={adSlot} onClose={() => setShowEditForm(false)} />}
    </>
  );
}
