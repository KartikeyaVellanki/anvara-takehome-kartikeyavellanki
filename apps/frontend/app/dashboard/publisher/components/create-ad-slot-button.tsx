'use client';

import { useState } from 'react';
import { AdSlotForm } from './ad-slot-form';

export function CreateAdSlotButton() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="rounded-md bg-[--color-primary] px-4 py-2 text-white hover:opacity-90"
      >
        Create Ad Slot
      </button>

      {showForm && <AdSlotForm onClose={() => setShowForm(false)} />}
    </>
  );
}
