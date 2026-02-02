'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { AdSlot } from '@/lib/types';
import { AdSlotForm } from './ad-slot-form';
import { DeleteAdSlotButton } from './delete-ad-slot-button';
import { toggleAdSlotAvailability, type ActionState } from '../actions';
import { Button } from '@/app/components/ui/button';
import { StatusBadge } from '@/app/components/ui/badge';

interface AdSlotCardProps {
  adSlot: AdSlot;
}

/**
 * Toggle availability button with pending state
 */
function ToggleButton({ isAvailable }: { isAvailable: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={isAvailable ? 'secondary' : 'primary'}
      size="sm"
      isLoading={pending}
    >
      {isAvailable ? 'Mark Booked' : 'Mark Available'}
    </Button>
  );
}

const initialState: ActionState = {};

/**
 * Ad Slot Card Component
 *
 * Displays ad slot information with edit/delete actions.
 * Clean Swiss design without emojis.
 */
export function AdSlotCard({ adSlot }: AdSlotCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [, formAction] = useActionState(toggleAdSlotAvailability, initialState);

  return (
    <>
      <div className="group rounded-2xl border border-[var(--card-border)] bg-[var(--glass-surface)] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--card-border-hover)] hover:shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="font-display text-[--text-base] font-semibold text-[--color-text] transition-colors group-hover:text-[--accent]">
            {adSlot.name}
          </h3>
          <span className="text-[--text-label-small] font-semibold uppercase tracking-[0.22em] text-[--color-text-muted]">
            {adSlot.type}
          </span>
        </div>

        {/* Description */}
        {adSlot.description && (
          <p className="mb-4 text-[--text-sm] leading-relaxed text-[--color-text-secondary] line-clamp-2">
            {adSlot.description}
          </p>
        )}

        {/* Price & Status */}
        <div className="mb-4 flex items-center justify-between rounded-xl border border-white/10 bg-[var(--glass-surface-strong)] p-3 backdrop-blur">
          <StatusBadge status={adSlot.isAvailable ? 'available' : 'booked'} />
          <div className="text-right">
            <span className="font-display text-[--text-lg] font-semibold text-[--accent]">
              ${Number(adSlot.basePrice).toLocaleString()}
            </span>
            <span className="text-[--text-sm] text-[--color-text-muted]">/mo</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
          <form action={formAction}>
            <input type="hidden" name="id" value={adSlot.id} />
            <input type="hidden" name="isAvailable" value={String(adSlot.isAvailable)} />
            <ToggleButton isAvailable={adSlot.isAvailable} />
          </form>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowEditForm(true)}>
              Edit
            </Button>
            <DeleteAdSlotButton adSlotId={adSlot.id} adSlotName={adSlot.name} />
          </div>
        </div>
      </div>

      {showEditForm && <AdSlotForm adSlot={adSlot} onClose={() => setShowEditForm(false)} />}
    </>
  );
}
