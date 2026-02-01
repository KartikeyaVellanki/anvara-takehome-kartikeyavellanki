'use client';

import { useState } from 'react';
import { CampaignForm } from './campaign-form';
import { Button } from '@/app/components/ui/button';

/**
 * Create Campaign Button
 * Opens campaign form in a modal.
 */
export function CreateCampaignButton() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Button onClick={() => setShowForm(true)}>
        Create Campaign
      </Button>

      {showForm && <CampaignForm onClose={() => setShowForm(false)} />}
    </>
  );
}
