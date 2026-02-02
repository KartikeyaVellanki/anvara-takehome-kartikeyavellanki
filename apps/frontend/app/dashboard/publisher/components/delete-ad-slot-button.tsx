'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useState, useEffect, startTransition } from 'react';
import { deleteAdSlot, type ActionState } from '../actions';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from '@/app/components/ui/dialog';

interface DeleteAdSlotButtonProps {
  adSlotId: string;
  adSlotName: string;
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="danger" isLoading={pending}>
      {pending ? 'Deleting...' : 'Delete'}
    </Button>
  );
}

const initialState: ActionState = {};

/**
 * Delete Ad Slot Button
 * Shows confirmation dialog before deleting.
 */
export function DeleteAdSlotButton({ adSlotId, adSlotName }: DeleteAdSlotButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, formAction] = useActionState(deleteAdSlot, initialState);

  // Close modal on successful deletion
  useEffect(() => {
    if (state.success) {
      startTransition(() => {
        setShowConfirm(false);
      });
    }
  }, [state.success]);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowConfirm(true)}
        className="text-[--error] hover:text-[--color-text]"
      >
        Delete
      </Button>

      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)} size="sm">
        <DialogHeader onClose={() => setShowConfirm(false)}>
          <DialogTitle>Delete Ad Slot</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-[--text-sm] text-[--color-text-secondary]">
            Are you sure you want to delete &quot;{adSlotName}&quot;? This action cannot be undone.
          </p>

          {state.error && (
            <div className="mt-4 rounded-xl border border-[--error]/40 bg-[--error-light] p-3 text-[--text-sm] text-[--color-text]">
              {state.error}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <form action={formAction} className="flex items-center gap-3">
            <input type="hidden" name="id" value={adSlotId} />
            <Button type="button" variant="secondary" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <DeleteButton />
          </form>
        </DialogFooter>
      </Dialog>
    </>
  );
}
