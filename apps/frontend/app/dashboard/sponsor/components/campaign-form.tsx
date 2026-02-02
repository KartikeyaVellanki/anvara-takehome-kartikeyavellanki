'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { createCampaign, updateCampaign, type ActionState } from '../actions';
import type { Campaign } from '@/lib/types';
import { Button } from '@/app/components/ui/button';
import { Input, Textarea, Select, Label, HelperText } from '@/app/components/ui/input';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from '@/app/components/ui/dialog';

interface CampaignFormProps {
  campaign?: Campaign;
  onClose: () => void;
  onSuccess?: () => void;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isLoading={pending}>
      {pending ? 'Saving...' : isEditing ? 'Update Campaign' : 'Create Campaign'}
    </Button>
  );
}

const initialState: ActionState = {};

/**
 * Campaign Form
 * Create or edit a campaign with validation.
 */
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
    <Dialog open={true} onClose={onClose} size="lg">
      <DialogHeader onClose={onClose}>
        <DialogTitle>{isEditing ? 'Edit Campaign' : 'Create Campaign'}</DialogTitle>
      </DialogHeader>

      <form ref={formRef} action={formAction}>
        <DialogBody className="space-y-5">
          {isEditing && <input type="hidden" name="id" value={campaign.id} />}

          {/* Error Alert */}
          {state.error && (
            <div className="rounded-xl border border-[--error]/40 bg-[--error-light] p-4 text-[--text-sm] text-[--color-text]">
              {state.error}
            </div>
          )}

          <div>
            <Label htmlFor="name" required>
              Campaign Name
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              defaultValue={campaign?.name || ''}
              placeholder="Enter campaign name"
              error={Boolean(state.fieldErrors?.name)}
              autoFocus
            />
            {state.fieldErrors?.name && <HelperText error>{state.fieldErrors.name}</HelperText>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={campaign?.description || ''}
              rows={3}
              placeholder="Describe your campaign goals..."
            />
          </div>

          <div>
            <Label htmlFor="budget" required>
              Budget ($)
            </Label>
            <Input
              type="number"
              id="budget"
              name="budget"
              defaultValue={campaign?.budget || ''}
              min={1}
              step={0.01}
              placeholder="1000"
              error={Boolean(state.fieldErrors?.budget)}
            />
            {state.fieldErrors?.budget && <HelperText error>{state.fieldErrors.budget}</HelperText>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="startDate" required>
                Start Date
              </Label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                defaultValue={formatDateForInput(campaign?.startDate)}
                error={Boolean(state.fieldErrors?.startDate)}
              />
              {state.fieldErrors?.startDate && (
                <HelperText error>{state.fieldErrors.startDate}</HelperText>
              )}
            </div>
            <div>
              <Label htmlFor="endDate" required>
                End Date
              </Label>
              <Input
                type="date"
                id="endDate"
                name="endDate"
                defaultValue={formatDateForInput(campaign?.endDate)}
                error={Boolean(state.fieldErrors?.endDate)}
              />
              {state.fieldErrors?.endDate && (
                <HelperText error>{state.fieldErrors.endDate}</HelperText>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" defaultValue={campaign?.status || 'DRAFT'}>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="COMPLETED">Completed</option>
            </Select>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <SubmitButton isEditing={isEditing} />
        </DialogFooter>
      </form>
    </Dialog>
  );
}
