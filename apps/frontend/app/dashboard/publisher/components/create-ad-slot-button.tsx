'use client';

import { useState } from 'react';
import { AdSlotForm } from './ad-slot-form';
import { Button } from '@/app/components/ui/button';

/**
 * Create Ad Slot Button
 * Opens ad slot form in a modal.
 */
export function CreateAdSlotButton() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Button onClick={() => setShowForm(true)}>Create Ad Slot</Button>

      {showForm && <AdSlotForm onClose={() => setShowForm(false)} />}
    </>
  );
}
