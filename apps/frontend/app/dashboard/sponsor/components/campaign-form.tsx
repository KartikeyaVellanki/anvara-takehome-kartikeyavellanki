'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { createCampaign, updateCampaign, type ActionState } from '../actions';
import type { Campaign } from '@/lib/types';

interface CampaignFormProps {
  campaign?: Campaign;
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
      {pending ? 'Saving...' : isEditing ? 'Update Campaign' : 'Create Campaign'}
    </button>
  );
}

const initialState: ActionState = {};

export function CampaignForm({ campaign, onClose, onSuccess }: CampaignFormProps) {
  const isEditing = !!campaign;
  const action = isEditing ? updateCampaign : createCampaign;
  const [state, formAction] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Close form on success
  useEffect(() => {
    if (state.success) {
      onSuccess?.();
      onClose();
    }
  }, [state.success, onClose, onSuccess]);

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-[--color-background] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Campaign' : 'Create Campaign'}
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
          {isEditing && <input type="hidden" name="id" value={campaign.id} />}

          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Campaign Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={campaign?.name || ''}
              className="w-full rounded-md border border-[--color-border] bg-[--color-background] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
              placeholder="Enter campaign name"
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
              defaultValue={campaign?.description || ''}
              rows={3}
              className="w-full rounded-md border border-[--color-border] bg-[--color-background] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
              placeholder="Describe your campaign"
            />
          </div>

          <div>
            <label htmlFor="budget" className="mb-1 block text-sm font-medium">
              Budget ($) *
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              defaultValue={campaign?.budget || ''}
              min="1"
              step="0.01"
              className="w-full rounded-md border border-[--color-border] bg-[--color-background] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
              placeholder="1000"
            />
            {state.fieldErrors?.budget && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.budget}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="mb-1 block text-sm font-medium">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                defaultValue={formatDateForInput(campaign?.startDate)}
                className="w-full rounded-md border border-[--color-border] bg-[--color-background] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
              />
              {state.fieldErrors?.startDate && (
                <p className="mt-1 text-sm text-red-600">{state.fieldErrors.startDate}</p>
              )}
            </div>
            <div>
              <label htmlFor="endDate" className="mb-1 block text-sm font-medium">
                End Date *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                defaultValue={formatDateForInput(campaign?.endDate)}
                className="w-full rounded-md border border-[--color-border] bg-[--color-background] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
              />
              {state.fieldErrors?.endDate && (
                <p className="mt-1 text-sm text-red-600">{state.fieldErrors.endDate}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="status" className="mb-1 block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={campaign?.status || 'DRAFT'}
              className="w-full rounded-md border border-[--color-border] bg-[--color-background] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="COMPLETED">Completed</option>
            </select>
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
