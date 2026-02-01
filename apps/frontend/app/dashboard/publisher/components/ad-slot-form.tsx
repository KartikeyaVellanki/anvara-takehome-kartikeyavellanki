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

// Submit button with pending state and animation
function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-w-[140px] items-center justify-center gap-2 rounded-lg bg-[--color-secondary] px-5 py-3 font-medium text-white shadow-sm transition-all hover:bg-[--color-secondary-hover] hover:shadow-md disabled:opacity-50"
    >
      {pending && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
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

  // Common input classes for touch-friendly sizing
  const inputClasses =
    'w-full rounded-lg border border-[--color-border] bg-[--color-background] px-4 py-3 text-base transition-colors focus:border-[--color-secondary] focus:outline-none focus:ring-2 focus:ring-[--color-secondary]/20';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal - full screen on mobile, centered card on desktop */}
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-[--color-background] p-6 shadow-xl animate-in slide-in-from-bottom duration-300 sm:max-w-lg sm:rounded-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{isEditing ? 'Edit Ad Slot' : 'Create Ad Slot'}</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[--color-muted] transition-colors hover:bg-slate-100 hover:text-[--color-foreground] dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Error Alert */}
        {state.error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <span className="text-xl">⚠️</span>
            <span className="text-sm font-medium">{state.error}</span>
          </div>
        )}

        <form ref={formRef} action={formAction} className="space-y-5">
          {isEditing && (
            <>
              <input type="hidden" name="id" value={adSlot.id} />
              <input type="hidden" name="isAvailable" value={String(adSlot.isAvailable)} />
            </>
          )}

          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Ad Slot Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={adSlot?.name || ''}
              className={inputClasses}
              placeholder="Enter ad slot name"
              autoFocus
            />
            {state.fieldErrors?.name && (
              <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                <span>⚠</span> {state.fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={adSlot?.description || ''}
              rows={3}
              className={inputClasses}
              placeholder="Describe your ad slot placement and audience..."
            />
          </div>

          <div>
            <label htmlFor="type" className="mb-2 block text-sm font-medium">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              defaultValue={adSlot?.type || ''}
              className={inputClasses}
            >
              <option value="">Select a type</option>
              <option value="DISPLAY">🖼️ Display</option>
              <option value="VIDEO">🎬 Video</option>
              <option value="NATIVE">📱 Native</option>
              <option value="NEWSLETTER">📧 Newsletter</option>
              <option value="PODCAST">🎙️ Podcast</option>
            </select>
            {state.fieldErrors?.type && (
              <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                <span>⚠</span> {state.fieldErrors.type}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="basePrice" className="mb-2 block text-sm font-medium">
              Base Price ($/month) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="basePrice"
              name="basePrice"
              defaultValue={adSlot?.basePrice || ''}
              min="1"
              step="0.01"
              inputMode="decimal"
              className={inputClasses}
              placeholder="500"
            />
            {state.fieldErrors?.basePrice && (
              <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                <span>⚠</span> {state.fieldErrors.basePrice}
              </p>
            )}
          </div>

          {/* Actions - sticky on mobile */}
          <div className="flex flex-col-reverse gap-3 border-t border-[--color-border] pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[--color-border] px-5 py-3 font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
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
