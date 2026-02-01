'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';
import { deleteAdSlot, type ActionState } from '../actions';

interface DeleteAdSlotButtonProps {
  adSlotId: string;
  adSlotName: string;
}

function DeleteButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  );
}

const initialState: ActionState = {};

export function DeleteAdSlotButton({ adSlotId, adSlotName }: DeleteAdSlotButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, formAction] = useActionState(deleteAdSlot, initialState);

  // Close modal on successful deletion
  // This is an intentional response to server action state change
  useEffect(() => {
    if (state.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowConfirm(false);
    }
  }, [state.success]);

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-sm text-red-600 hover:text-red-700"
        title="Delete ad slot"
      >
        Delete
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-[--color-background] p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold">Delete Ad Slot</h3>
            <p className="mb-4 text-[--color-muted]">
              Are you sure you want to delete &quot;{adSlotName}&quot;? This action cannot be
              undone.
            </p>

            {state.error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                {state.error}
              </div>
            )}

            <form action={formAction}>
              <input type="hidden" name="id" value={adSlotId} />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="rounded-md border border-[--color-border] px-4 py-2 hover:bg-[--color-border]/20"
                >
                  Cancel
                </button>
                <DeleteButton />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
