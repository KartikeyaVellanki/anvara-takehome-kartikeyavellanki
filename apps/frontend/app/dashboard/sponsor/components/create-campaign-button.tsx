'use client';

import { useState } from 'react';
import { CampaignForm } from './campaign-form';

export function CreateCampaignButton() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="rounded-md bg-[--color-primary] px-4 py-2 text-white hover:opacity-90"
      >
        Create Campaign
      </button>

      {showForm && <CampaignForm onClose={() => setShowForm(false)} />}
    </>
  );
}
