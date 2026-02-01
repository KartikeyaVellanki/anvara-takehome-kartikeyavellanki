'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { createAdSlot, updateAdSlot, type ActionState } from '../actions';
import type { AdSlot } from '@/lib/types';

interface AdSlotFormProps {
  adSlot?: AdSlot;
  onClose: () => void;
  onSuccess?: () => void;
}

// Submit button with pending state
function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-[--color-primary] px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Saving...' : isEditing ? 'Update Ad Slot' : 'Create Ad Slot'}
    </button>
  );
}

const initialState: ActionState = {};

export function AdSlotForm({ adSlot, onClose, onSuccess }: AdSlotFormProps) {
  const isEditing = !!adSlot;
  const action = isEditing ? updateAdSlot : createAdSlot;
  const [state, formAction] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Close form on success
  useEffect(() => {
    if (state.success) {
      onSuccess?.();
      onClose();
    }
  }, [state.success, onClose, onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-[--color-background] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Ad Slot' : 'Create Ad Slot'}
          </h2>
          <button
            onClick={onClose}
            className="text-[--color-muted] hover:text-[--color-text]"
          >
            ✕
          </button>
        </div>

        {state.error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}

        <form ref={formRef} action={formAction} className="space-y-4">
          {isEditing && (
            <>
              <input type="hidden" name="id" value={adSlot.id} />
              <input type="hidden" name="isAvailable" value={String(adSlot.isAvailable)} />
            </>
          )}

          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Ad Slot Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={adSlot?.name || ''}
              className="w-full rounded-md border border-[--color-border] bg-[--color-background] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
              placeholder="Enter ad slot name"
            />
            {state.fieldErrors?.name && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={adSlot?.description || ''}
              rows={3}
              className="w-full rounded-md border border-[--color-border] bg-[--color-background] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
              placeholder="Describe your ad slot"
            />
          </div>

          <div>
            <label htmlFor="type" className="mb-1 block text-sm font-medium">
              Type *
            </label>
            <select
              id="type"
              name="type"
              defaultValue={adSlot?.type || ''}
              className="w-full rounded-md border border-[--color-border] bg-[--color-background] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
            >
              <option value="">Select a type</option>
              <option value="DISPLAY">Display</option>
              <option value="VIDEO">Video</option>
              <option value="NATIVE">Native</option>
              <option value="NEWSLETTER">Newsletter</option>
              <option value="PODCAST">Podcast</option>
            </select>
            {state.fieldErrors?.type && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.type}</p>
            )}
          </div>

          <div>
            <label htmlFor="basePrice" className="mb-1 block text-sm font-medium">
              Base Price ($/month) *
            </label>
            <input
              type="number"
              id="basePrice"
              name="basePrice"
              defaultValue={adSlot?.basePrice || ''}
              min="1"
              step="0.01"
              className="w-full rounded-md border border-[--color-border] bg-[--color-background] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
              placeholder="500"
            />
            {state.fieldErrors?.basePrice && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.basePrice}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[--color-border] px-4 py-2 hover:bg-[--color-border]/20"
            >
              Cancel
            </button>
            <SubmitButton isEditing={isEditing} />
          </div>
        </form>
      </div>
    </div>
  );
}
