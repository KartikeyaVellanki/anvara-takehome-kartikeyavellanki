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
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NATIVE: 'bg-green-100 text-green-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

// Toggle button with pending state
function ToggleButton({ isAvailable }: { isAvailable: boolean }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className={`text-xs px-2 py-1 rounded ${
        isAvailable 
          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
          : 'bg-green-100 text-green-700 hover:bg-green-200'
      } disabled:opacity-50`}
    >
      {pending ? '...' : isAvailable ? 'Mark Booked' : 'Mark Available'}
    </button>
  );
}

const initialState: ActionState = {};

export function AdSlotCard({ adSlot }: AdSlotCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [, formAction] = useActionState(toggleAdSlotAvailability, initialState);

  return (
    <>
      <div className="rounded-lg border border-[--color-border] p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-semibold">{adSlot.name}</h3>
          <span className={`rounded px-2 py-0.5 text-xs ${typeColors[adSlot.type] || 'bg-gray-100'}`}>
            {adSlot.type}
          </span>
        </div>

        {adSlot.description && (
          <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{adSlot.description}</p>
        )}

        <div className="mb-3 flex items-center justify-between">
          <span
            className={`text-sm ${adSlot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
          >
            {adSlot.isAvailable ? 'Available' : 'Booked'}
          </span>
          <span className="font-semibold text-[--color-primary]">
            ${Number(adSlot.basePrice).toLocaleString()}/mo
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-[--color-border] pt-3">
          <form action={formAction}>
            <input type="hidden" name="id" value={adSlot.id} />
            <input type="hidden" name="isAvailable" value={String(adSlot.isAvailable)} />
            <ToggleButton isAvailable={adSlot.isAvailable} />
          </form>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEditForm(true)}
              className="text-sm text-[--color-primary] hover:underline"
            >
              Edit
            </button>
            <DeleteAdSlotButton adSlotId={adSlot.id} adSlotName={adSlot.name} />
          </div>
        </div>
      </div>

      {showEditForm && (
        <AdSlotForm adSlot={adSlot} onClose={() => setShowEditForm(false)} />
      )}
    </>
  );
}
