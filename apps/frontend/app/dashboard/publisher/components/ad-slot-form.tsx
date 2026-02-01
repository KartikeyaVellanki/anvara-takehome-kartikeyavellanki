'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { createAdSlot, updateAdSlot, type ActionState } from '../actions';
import type { AdSlot } from '@/lib/types';
import { Button } from '@/app/components/ui/button';
import { Input, Textarea, Select, Label, HelperText } from '@/app/components/ui/input';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from '@/app/components/ui/dialog';

interface AdSlotFormProps {
  adSlot?: AdSlot;
  onClose: () => void;
  onSuccess?: () => void;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isLoading={pending}>
      {pending ? 'Saving...' : isEditing ? 'Update Ad Slot' : 'Create Ad Slot'}
    </Button>
  );
}

const initialState: ActionState = {};

/**
 * Ad Slot Form
 * Create or edit an ad slot with validation.
 */
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
    <Dialog open={true} onClose={onClose} size="lg">
      <DialogHeader onClose={onClose}>
        <DialogTitle>{isEditing ? 'Edit Ad Slot' : 'Create Ad Slot'}</DialogTitle>
      </DialogHeader>

      <form ref={formRef} action={formAction}>
        <DialogBody className="space-y-5">
          {isEditing && (
            <>
              <input type="hidden" name="id" value={adSlot.id} />
              <input type="hidden" name="isAvailable" value={String(adSlot.isAvailable)} />
            </>
          )}

          {/* Error Alert */}
          {state.error && (
            <div className="border border-[--error] bg-[--error-light] p-4 text-[--text-sm] text-red-800">
              {state.error}
            </div>
          )}

          <div>
            <Label htmlFor="name" required>
              Ad Slot Name
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              defaultValue={adSlot?.name || ''}
              placeholder="Enter ad slot name"
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
              defaultValue={adSlot?.description || ''}
              rows={3}
              placeholder="Describe your ad slot placement and audience..."
            />
          </div>

          <div>
            <Label htmlFor="type" required>
              Type
            </Label>
            <Select
              id="type"
              name="type"
              defaultValue={adSlot?.type || ''}
              error={Boolean(state.fieldErrors?.type)}
            >
              <option value="">Select a type</option>
              <option value="DISPLAY">Display</option>
              <option value="VIDEO">Video</option>
              <option value="NATIVE">Native</option>
              <option value="NEWSLETTER">Newsletter</option>
              <option value="PODCAST">Podcast</option>
            </Select>
            {state.fieldErrors?.type && <HelperText error>{state.fieldErrors.type}</HelperText>}
          </div>

          <div>
            <Label htmlFor="basePrice" required>
              Base Price ($/month)
            </Label>
            <Input
              type="number"
              id="basePrice"
              name="basePrice"
              defaultValue={adSlot?.basePrice || ''}
              min={1}
              step={0.01}
              placeholder="500"
              error={Boolean(state.fieldErrors?.basePrice)}
            />
            {state.fieldErrors?.basePrice && (
              <HelperText error>{state.fieldErrors.basePrice}</HelperText>
            )}
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
